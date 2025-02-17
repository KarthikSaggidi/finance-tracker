import "./globals.css"; // Import Tailwind styles

export const metadata = {
  title: "Personal Finance Tracker",
  description: "Track your expenses easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}