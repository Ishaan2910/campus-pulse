import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CampusPulse AI | B.Tech CSE (AI & ML)",
  description: "Autonomous Student Academic Intelligence & Explainable Action Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        />
      </head>
      <body className="bg-gray-50 text-gray-800 antialiased m-0 p-0">
        {children}
      </body>
    </html>
  );
}