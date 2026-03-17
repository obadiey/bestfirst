import { getCurrentUserWithRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreateForm from "./CreateForm";

export default async function CreateExperiencePage() {
  const user = await getCurrentUserWithRole();
  if (!user) redirect("/auth?mode=login");
  if (user.activeRole !== "INVITER") redirect("/dashboard");

  return (
    <div className="pb-24">
      <Navbar user={user} />
      <div className="max-w-lg mx-auto px-5 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Create a Date</h1>
        <p className="text-[15px] text-gray-400 mb-6">
          Plan your own experience (1 per week, free)
        </p>
        <CreateForm />
      </div>
    </div>
  );
}
