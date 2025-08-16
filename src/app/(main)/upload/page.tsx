import Navigation from "@/app/(main)/components/Navigation";
import UploadForm from "../components/UploadForm";

export default function UploadPage() {
  return (
    <>
      <Navigation />
      <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden md:pl-16">
        <div className="flex-1 flex justify-center items-center p-4 pb-20 md:pb-4">
          <UploadForm />
        </div>
      </div>
    </>
  );
}