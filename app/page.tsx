import Image from "next/image";
import { Dashboard } from "@/components/dashboard";
import { Poppins, Baloo_Bhai_2 } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const balooBhai2 = Baloo_Bhai_2({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main>
      <Dashboard />
    </main>
  );
}
