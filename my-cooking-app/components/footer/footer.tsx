export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-text py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Top Section (Centered Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-20 text-center">
          {/* Privacy Policy */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-footer-text">
              Privacy Policy
            </h3>

            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Information We Collect
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  How We Use Your Information
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Cookies & Tracking Technologies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Data Storage & Security
                </a>
              </li>
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-footer-text">
              Terms and Conditions
            </h3>

            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Acceptance of Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  User Responsibilities
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Accounts & Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Payment
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-footer-text">
              Social Media
            </h3>

            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline px-3  p-2 hover:text-primary"
                >
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Bottom Text */}
        <div className="border-t border-border mt-10 pt-4 text-center text-sm">
          © 2025 RecipeShare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
