import "../styles/globals.css";

import type { AppProps } from "next/app";
import Nav from "../components/navbar/NavBar";
import Footer from "../components/footer/footer";
import { ThemeProvider } from "next-themes";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen flex flex-col bg-main-bg">
        <Nav />

        <main className="flex-1 p-5">
          <Component {...pageProps} />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
