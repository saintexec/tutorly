import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12 font-sans relative z-0">
      <div className="w-full max-w-[420px] flex flex-col items-center z-10">
        {children}
      </div>
      
      {/* Decorative background elements from design */}
      <div className="fixed bottom-12 right-0 w-32 h-32 bg-[#e0e3e5]/20 rounded-tl-[100px] -z-10" />
      <div className="fixed bottom-8 left-8 flex flex-col gap-2 -z-10 opacity-30">
        <div className="w-16 h-[2px] bg-[#c4c6cf]" />
        <div className="w-10 h-[2px] bg-[#c4c6cf]" />
      </div>
    </div>
  );
}
