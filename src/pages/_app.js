import "@/styles/globals.css";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sora", // generates a CSS variable for the font
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={sora.variable}>
      <Component {...pageProps} />
    </main>
  );
}
