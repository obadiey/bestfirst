import { getCurrentUserWithRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import InviterBrowse from "./InviterBrowse";
import InviteeBrowse from "./InviteeBrowse";

export default async function ExperiencesPage() {
  const user = await getCurrentUserWithRole();
  if (!user) redirect("/auth?mode=login");

  const isInviter = user.activeRole === "INVITER";

  return (
    <div className="pb-24">
      <Navbar user={user} />
      <div className="max-w-lg mx-auto px-5 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
          {isInviter ? "Experiences" : "Available Dates"}
        </h1>
        <p className="text-[15px] text-gray-400 mb-6">
          {isInviter ? "Bid on curated date experiences" : "Find a date that excites you"}
        </p>
        {isInviter ? <InviterBrowse /> : <InviteeBrowse />}
      </div>
    </div>
  );
}
