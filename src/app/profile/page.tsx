import { getCurrentUserWithRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user = await getCurrentUserWithRole();
  if (!user) redirect("/auth?mode=login");

  const photos = await prisma.profilePhoto.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });
  const prompts = await prisma.profilePrompt.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });

  return (
    <div className="pb-24">
      <Navbar user={user} />
      <div className="max-w-lg mx-auto px-5 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
        <ProfileForm
          user={user}
          initialPhotos={photos.map((p) => p.url)}
          initialPrompts={prompts.map((p) => ({ prompt: p.prompt, answer: p.answer }))}
        />
      </div>
    </div>
  );
}
