import { getCurrentUserWithRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user = await getCurrentUserWithRole();
  if (!user) redirect("/auth?mode=login");

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
