import "./globals.css";

export const metadata = {
  title: "Meridian Estates | Curated luxury properties",
  description: "Discover exceptional homes, curated for the discerning few.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
