import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import InviterBrowse from "./InviterBrowse";
import InviteeBrowse from "./InviteeBrowse";

export default async function ExperiencesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth?mode=login");

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">
          {user.role === "INVITER"
            ? "Available Experiences"
            : "Available Dates"}
        </h1>
        <p className="text-gray-500 mb-8">
          {user.role === "INVITER"
            ? "Bid on curated date experiences"
            : "Browse dates and opt into ones you like"}
        </p>
        {user.role === "INVITER" ? <InviterBrowse /> : <InviteeBrowse />}
      </div>
    </div>
  );
}
