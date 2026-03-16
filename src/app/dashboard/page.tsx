import { getCurrentUserWithRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import InviterDashboard from "./InviterDashboard";
import InviteeDashboard from "./InviteeDashboard";

export default async function DashboardPage() {
  const user = await getCurrentUserWithRole();
  if (!user) redirect("/auth?mode=login");

  const isInviter = user.activeRole === "INVITER";

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-500 mb-8">
          Manage your dates from both sides
        </p>

        {/* Primary section (active role) */}
        {isInviter ? (
          <>
            <InviterDashboard />
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-4 text-gray-400">Your Invitee Activity</h2>
              <InviteeDashboard compact />
            </div>
          </>
        ) : (
          <>
            <InviteeDashboard />
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-4 text-gray-400">Your Inviter Activity</h2>
              <InviterDashboard compact />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
