import "@/app/globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Daily Reset",
  description: "Reset your mind in 3 minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
