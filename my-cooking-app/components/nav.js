import Link from "next/link";
import { useState } from "react";

// Simple Dropdown component
function Dropdown({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {title}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
          }}
        >
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{ margin: "5px 0" }}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "12px", flexWrap: "wrap" }}>
      {/* Home Dropdown */}
      <Dropdown
        title="Home"
        links={[
          { href: "/", label: "Welcome Feed" },
          { href: "/home/my-shortcuts", label: "My Shortcuts" },
          { href: "/home/notifications", label: "Notifications" },
        ]}
      />

      {/* Cook Dropdown */}
      <Dropdown
        title="Cook"
        links={[
          { href: "/cook", label: "Cook Main" },
          { href: "/cook/smart-filters", label: "Smart Filters" },
          { href: "/cook/saved-recipes", label: "Saved Recipes" },
        ]}
      />

      {/* Learn Dropdown */}
      <Dropdown
        title="Learn"
        links={[
          { href: "/learn", label: "Learn Main" },
          { href: "/learn/culinary-techniques", label: "Culinary Techniques" },
          { href: "/learn/cuisine-explorer", label: "Cuisine Explorer" },
        ]}
      />

      {/* Connect Dropdown */}
      <Dropdown
        title="Connect"
        links={[
          { href: "/connect", label: "Connect Main" },
          { href: "/connect/upload-recipe", label: "Upload Recipe" },
          { href: "/connect/recipe-storytelling", label: "Recipe Storytelling" },
          { href: "/connect/user-profiles", label: "User Profiles" },
        ]}
      />

      {/* Settings Dropdown */}
      <Dropdown
        title="Settings"
        links={[
          { href: "/settings", label: "Settings Main" },
          { href: "/settings/my-activity", label: "My Activity" },
          { href: "/settings/preferences", label: "Preferences" },
          { href: "/settings/account-management", label: "Account Management" },
        ]}
      />
    </nav>
  );
}
