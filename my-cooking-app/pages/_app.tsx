import "../styles/globals.css";

import type { AppProps } from "next/app";
import Nav from "../components/nav";
import Footer from "../components/footer";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Nav />
      <main className="p-5 bg-main-bg">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
