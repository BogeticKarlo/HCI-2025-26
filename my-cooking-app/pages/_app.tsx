import "../styles/globals.css";

import type { AppProps } from "next/app";
import Nav from "../components/nav";
import Footer from "../components/footer/footer";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-main-bg">
      <Nav />

      <main className="flex-1 p-5">
        <Component {...pageProps} />
      </main>

      <Footer />
    </div>
  );
}
