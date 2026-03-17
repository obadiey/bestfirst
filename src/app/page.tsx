import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
            bestfirst
          </h1>
          <p className="text-[17px] text-gray-500 leading-relaxed">
            The best first date you never planned.
          </p>
        </div>

        <p className="text-[15px] text-gray-400 mb-10 leading-relaxed">
          Browse curated date experiences. Bid for the ones you love.
          Get matched with someone amazing.
        </p>

        <div className="space-y-3">
          <Link
            href="/auth?mode=signup"
            className="block w-full bg-gray-900 text-white py-3.5 rounded-2xl text-[15px] font-medium hover:bg-gray-800 transition active:scale-[0.98]"
          >
            Get Started
          </Link>
          <Link
            href="/auth?mode=login"
            className="block w-full border border-gray-200 text-gray-700 py-3.5 rounded-2xl text-[15px] font-medium hover:bg-gray-50 transition active:scale-[0.98]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
