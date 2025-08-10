import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Vibes",
  description: "Your go-to social media platform to share moments, connect with friends, and explore a vibrant community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}