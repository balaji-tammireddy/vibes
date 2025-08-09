import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "The Pet Parlour",
  description: "Pet grooming and booking platform",
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