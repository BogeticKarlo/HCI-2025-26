// pages/_app.tsx
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Nav from "../components/navbar/NavBar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(router.pathname);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {isAuthRoute ? (
        <Component {...pageProps} />
      ) : (
        <div className="min-h-screen flex flex-col bg-main-bg">
          <Nav />

          <main className="flex-1 p-5">
            <Component {...pageProps} />
          </main>

          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
}
