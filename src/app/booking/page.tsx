import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Book a tutoring session.',
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center text-on-primary text-2xl font-700 shadow-ambient-md">
            AA
          </div>
          <div>
            <h1 className="font-[var(--font-display)] text-3xl font-700 text-on-surface tracking-tight">
              Academic Atelier
            </h1>
            <p className="text-on-surface-variant mt-2">
              Book your next tutoring session
            </p>
          </div>
        </div>

        {/* Details Wrapper */}
        <div className="bg-surface-container-lowest rounded-[var(--radius-2xl)] p-8 shadow-sm space-y-8">
            <h2 className="font-[var(--font-display)] text-xl font-600 text-on-surface">Select a time</h2>
            <div className="h-[300px] border border-dashed border-outline-variant/50 rounded-xl flex items-center justify-center text-on-surface-variant bg-surface-container-low/50">
                Booking calendar coming soon...
            </div>
            {/* Action */}
            <div className="pt-4 border-t border-outline-variant/15 flex justify-end">
                <button
                type="button"
                className="py-3 px-6 rounded-[var(--radius-lg)] gradient-primary text-on-primary font-600 text-sm tracking-wide transition-all duration-200 hover:shadow-[inset_0_0_0_100px_rgba(255,255,255,0.08)] active:scale-[0.98]"
                >
                Confirm Booking
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}
