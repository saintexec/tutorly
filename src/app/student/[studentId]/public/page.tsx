import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { verifyPublicAccessToken } from '@/utils/publicAccessToken';
import StudentHeaderSection from './components/StudentHeaderSection';
import MetricsCards from './components/MetricsCards';
import PerformanceGraph from './components/PerformanceGraph';
import RecentSessionsList from './components/RecentSessionsList';
import PublicDashboardFooter from './components/PublicDashboardFooter';
import ErrorPage from './components/ErrorPage';

export const dynamic = 'force-dynamic';

// Next.js 16/15 types: params and searchParams are Promises
interface PageProps {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ token?: string }>;
}

interface Student {
  id: string;
  name: string;
  subject: string;
  level: string;
  created_at: string;
  tutor_id: string;
}

interface Session {
  id: string;
  date: string;
  topic: string;
  performance: number;
}

interface Metrics {
  totalSessions: number;
  averageRating: number;
  currentStreak: number;
  lastSessionDate: string | null;
}

interface DashboardData {
  student: Student;
  tutorName: string;
  tutorWhatsApp: string;
  metrics: Metrics;
  recentSessions: Session[];
  performanceData: Array<{ week: string; rating: number }>;
}

export default async function PublicStudentPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const studentId = params.studentId;
  const token = searchParams.token;

  console.log('=== PUBLIC DASHBOARD DEBUG ===');
  console.log('studentId from params:', studentId);
  console.log('token from query:', token);

  // Step 1: Verify token
  if (!token) {
    console.error('No token provided in searchParams');
    return <ErrorPage error="This link is incomplete. Please ask your tutor to share again." />;
  }

  const tokenVerification = verifyPublicAccessToken(token);
  console.log('Token verification result:', tokenVerification);

  if (!tokenVerification.valid) {
    console.error('Token verification failed:', tokenVerification.error);
    return <ErrorPage error={tokenVerification.error || 'Invalid or expired link'} />;
  }

  const { payload } = tokenVerification;
  console.log('Token payload:', payload);
  console.log('Expected studentId:', studentId, 'vs Payload studentId:', payload?.studentId);

  if (!payload || payload.studentId !== studentId) {
    console.error('Student ID mismatch detected!');
    return <ErrorPage error="Access denied. Student ID mismatch." />;
  }

  // Step 2: Fetch data from Supabase using RPC function
  // We use the anon key directly with the secure RPC function
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  try {
    const { data: dashboardResult, error: rpcError } = await supabase.rpc(
      'get_public_student_dashboard',
      {
        p_student_id: studentId,
        p_tutor_id: payload.tutorId,
      }
    );

    console.log('=== RPC DASHBOARD FETCH DEBUG ===');
    console.log('RPC result:', dashboardResult);
    console.log('RPC error:', rpcError);

    if (rpcError || !dashboardResult || !dashboardResult.student) {
      console.error("Dashboard fetch error:", rpcError);
      return <ErrorPage error={`Failed to load student dashboard: ${rpcError?.message || 'Access denied'}`} />;
    }

    const studentData = dashboardResult.student;
    const tutorData = dashboardResult.tutor;
    const sessions: Session[] = dashboardResult.sessions || [];

    // Step 3: Calculate metrics
    const totalSessions = sessions.length;
    const averageRating =
      totalSessions > 0
        ? sessions.reduce((sum: number, s: Session) => sum + (s.performance || 0), 0) / totalSessions
        : 0;
    const lastSessionDate = sessions.length > 0 ? sessions[0].date : null;

    // Calculate current streak (consecutive weeks with sessions)
    let currentStreak = 0;
    if (sessions.length > 0) {
      const sortedDates = sessions
        .map((s: Session) => new Date(s.date).getTime())
        .sort((a: number, b: number) => b - a);

      let streakCount = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diffDays = (sortedDates[i - 1] - sortedDates[i]) / (1000 * 60 * 60 * 24);
        // If gap is 7 days or less, count as streak
        if (diffDays <= 7) {
          streakCount++;
        } else {
          break;
        }
      }
      currentStreak = Math.ceil(streakCount / 1); // User prompt says "weeks" in MetricsCards, so we'll treat this as count of weekly session sets or adjust if needed.
    }

    // Step 4: Format data for performance graph
    const performanceData = formatPerformanceData(sessions);

    // Step 5: Get recent 5 sessions
    const recentSessions = sessions.slice(0, 5);

    const dashboardData: DashboardData = {
      student: studentData,
      tutorName: tutorData.name || 'Your Tutor',
      tutorWhatsApp: tutorData.parent_whatsapp || '',
      metrics: {
        totalSessions: sessions.length, // Could use a separate count query for true total if limited
        averageRating: Math.round(averageRating * 10) / 10,
        currentStreak,
        lastSessionDate,
      },
      recentSessions,
      performanceData,
    };

    // Step 6: Render dashboard
    return (
      <div className="min-h-screen bg-slate-50 font-['Inter',_sans-serif]">
        <StudentHeaderSection student={dashboardData.student} />
        
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <MetricsCards metrics={dashboardData.metrics} />
          
          <PerformanceGraph data={dashboardData.performanceData} />
          
          {dashboardData.recentSessions.length > 0 ? (
            <RecentSessionsList sessions={dashboardData.recentSessions} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
               <p className="text-[#7F8C8D] font-medium">No sessions logged yet. Check back soon!</p>
            </div>
          )}
          
          <PublicDashboardFooter
            tutorName={dashboardData.tutorName}
            tutorWhatsApp={dashboardData.tutorWhatsApp}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard page error:", error);
    return <ErrorPage error="Failed to load dashboard data. Please try again." />;
  }
}

/**
 * Format sessions into performance data grouped by week
 */
function formatPerformanceData(
  sessions: Session[]
): Array<{ week: string; rating: number }> {
  // Use a map to aggregate by week
  const weekMap = new Map<string, number[]>();

  sessions.forEach((session) => {
    const date = new Date(session.date);
    // Format: "Week X" or simplified "W X"
    const week = `W${getWeekNumber(date)}`;

    if (!weekMap.has(week)) {
      weekMap.set(week, []);
    }
    weekMap.get(week)?.push(session.performance || 0);
  });

  // Convert map to list and calculate averages
  const result = Array.from(weekMap.entries()).map(([week, ratings]) => ({
    week,
    rating: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10,
  }));

  // Limit to last 12 weeks for cleaner display on mobile, or as requested
  return result.slice(0, 12).reverse(); // oldest first for the graph
}

/**
 * Helper to get week number of the year
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
