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
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Edit Profile</h1>
            <p className="text-gray-400">Update your profile information</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
            <EditProfileForm username={username} />
          </div>
        </div>
      </div>
    </div>
  );
}