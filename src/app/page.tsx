import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Best First Date
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          The best first date you never planned.
        </p>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Browse curated date experiences. Bid for the ones you love.
          Get matched with someone amazing.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth?mode=signup"
            className="bg-brand-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-brand-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/auth?mode=login"
            className="border-2 border-brand-600 text-brand-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-brand-50 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
