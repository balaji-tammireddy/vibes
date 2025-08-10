import Navigation from "@/app/(main)/components/Navigation";
import EditForm from "@/app/(main)/profile/[username]/EditForm";

type EditPostPageProps = {
  params: {
    username: string;
    postId: string;
  };
};

export default function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = params;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <div className="w-full md:w-64 border-b border-gray-800 md:border-b-0 ">
        <Navigation />
      </div>
      <div className="flex-1 p-4 flex justify-center items-start md:pr-50">
        <EditForm postId={postId} />
      </div>
    </div>
  );
}