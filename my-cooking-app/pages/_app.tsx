// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Nav from "../components/navbar/NavBar";
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
        router.push("/"); // redirect logged-in users away from login/signup
      }
    }
  }, [user, loading, router, isAuthRoute]);

  // Don't render anything until loading is done
  if (loading || (!user && !isAuthRoute)) return null;

  return children;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
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
      {!isAuthRoute && <Nav />}
      <main className="flex-1 p-5">
        <Component {...pageProps} />
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}
