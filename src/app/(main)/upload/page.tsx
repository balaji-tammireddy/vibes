import Navigation from "@/app/(main)/components/Navigation";
import UploadForm from "../components/UploadForm";

export default function UploadPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <div className="w-full md:w-20 border-b border-gray-800 md:border-b-0 ">
        <Navigation />
      </div>
      <div className="flex-1 p-4 flex justify-center items-start md:pr-50">
        <UploadForm />
      </div>
    </div>
  );
}
