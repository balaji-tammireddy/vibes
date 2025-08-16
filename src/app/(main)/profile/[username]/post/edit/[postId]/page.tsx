import Navigation from "@/app/(main)/components/Navigation";
import EditForm from "@/app/(main)/profile/[username]/EditForm";

type EditPostPageProps = {
  params: {
    username: string;
    postId: string;
  };
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Edit Post</h1>
            <p className="text-gray-400">Update your post content</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
            <EditForm postId={postId} />
          </div>
        </div>
      </div>
    </div>
  );
}