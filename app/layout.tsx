// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Poppins } from "next/font/google";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";

interface LayoutProps {
  children: React.ReactNode;
}
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartWater",
  description: "Software de gestión de distribuidores",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  return (
    <GoogleMapsProvider googleMapsApiKey={googleMapsApiKey}>
      <html lang="en">
        <body className={poppins.className}>
          <div className="flex">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </GoogleMapsProvider>
  );
}