import { LoginCard } from "@/features/auth/components/LoginCard";

export default function LoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-10 text-white light:bg-slate-50 light:text-slate-950">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(130deg,rgba(2,6,23,1)_0%,rgba(2,6,23,0.9)_52%,rgba(1,73,247,0.34)_100%)] light:bg-[linear-gradient(130deg,rgba(248,250,252,1)_0%,rgba(239,246,255,0.98)_52%,rgba(191,219,254,0.72)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-[linear-gradient(0deg,rgba(1,73,247,0.34),transparent)] light:bg-[linear-gradient(0deg,rgba(1,73,247,0.14),transparent)]" />
      <LoginCard />
    </main>
  );
}
