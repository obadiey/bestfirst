import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreateForm from "./CreateForm";

export default async function CreateExperiencePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth?mode=login");
  if (user.role !== "INVITER") redirect("/dashboard");

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">Create a Custom Date</h1>
        <p className="text-gray-500 mb-8">
          Plan your own date experience (1 per week, free)
        </p>
        <CreateForm />
      </div>
    </div>
  );
}
