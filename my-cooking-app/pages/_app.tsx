// pages/_app.tsx

import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(router.pathname);

  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthRoute) {
        router.push("/login");
      }
      if (user && isAuthRoute) {
        router.push("/");
      }
    }
  }, [user, loading, router, isAuthRoute]);

  if (loading || (!user && !isAuthRoute)) return null;

  return <>{children}</>;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My Cooking App</title>
        <link rel="icon" type="image/svg+xml" href="/assets/logo.svg" />
      </Head>

      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthGuard>
            <PageLayout Component={Component} pageProps={pageProps} />
          </AuthGuard>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

function PageLayout({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  const router = useRouter();
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(router.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-main-bg">
      {!isAuthRoute && <NavBar />}
      <main className="flex-1 px-3 py-4 sm:p-5">
        <Component {...pageProps} />
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}
