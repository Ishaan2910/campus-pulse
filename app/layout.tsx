import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CampusPulse AI",
  description: "B.Tech CSE AI & ML Platform",
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
      <body className="bg-gray-50 text-gray-800 m-0 p-0 antialiased">
        {children}
      </body>
    </html>
  );
}