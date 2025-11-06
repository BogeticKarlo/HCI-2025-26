import Nav from "../components/nav.js";
import Footer from "../components/footer.js";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <main style={{ padding: "20px" }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
