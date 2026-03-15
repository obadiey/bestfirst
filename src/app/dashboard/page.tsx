import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import InviterDashboard from "./InviterDashboard";
import InviteeDashboard from "./InviteeDashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth?mode=login");

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-500 mb-8">
          {user.role === "INVITER"
            ? "Manage your bids and dates"
            : "See your upcoming dates"}
        </p>
        {user.role === "INVITER" ? (
          <InviterDashboard />
        ) : (
          <InviteeDashboard />
        )}
      </div>
    </div>
  );
}
