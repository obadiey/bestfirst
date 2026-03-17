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
    <div className="pb-24">
      <Navbar user={user} />
      <div className="max-w-lg mx-auto px-5 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
          Hey, {user.name.split(" ")[0]}
        </h1>
        <p className="text-[15px] text-gray-400 mb-6">
          {isInviter ? "Plan something amazing" : "Find your next date"}
        </p>

        {isInviter ? (
          <>
            <InviterDashboard />
            <div className="mt-8">
              <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wider mb-3">
                Your Invitee Activity
              </h2>
              <InviteeDashboard compact />
            </div>
          </>
        ) : (
          <>
            <InviteeDashboard />
            <div className="mt-8">
              <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wider mb-3">
                Your Inviter Activity
              </h2>
              <InviterDashboard compact />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
