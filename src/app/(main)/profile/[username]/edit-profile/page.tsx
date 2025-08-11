import Navigation from "@/app/(main)/components/Navigation";
import EditProfileForm from "@/app/(main)/profile/[username]/EditProfileForm";

type EditProfilePageProps = {
  params: {
    username: string;
  };
};

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  const { username } = await params;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <div className="w-full md:w-64 border-b border-gray-800 md:border-b-0">
        <Navigation />
      </div>
      <div className="flex-1 p-4 flex justify-center items-start md:pr-50">
        <EditProfileForm username={username} />
      </div>
    </div>
  );
}
