import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My ChatMAX",
  description: "Created using NextJS",
  icons: {
    icon: "/assets/Logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-black dark:bg-gray-950 dark:text-white">{children}</body>
    </html>
  );
}
