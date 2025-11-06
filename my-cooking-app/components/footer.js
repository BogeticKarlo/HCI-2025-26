import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "20px",
        marginTop: "40px",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      <p>© 2025 Cooking Community</p>

      <nav style={{ marginTop: "10px" }}>
        <Link href="/footer/privacy-policy" style={{ margin: "0 10px" }}>
          Privacy Policy
        </Link>
        <Link href="/footer/terms" style={{ margin: "0 10px" }}>
          Terms
        </Link>
        <Link href="/footer/social-media" style={{ margin: "0 10px" }}>
          Social Media
        </Link>
      </nav>
    </footer>
  );
}
