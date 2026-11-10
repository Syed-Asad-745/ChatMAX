import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/core-components/Sidebar";
import Widgets from "@/components/core-components/Widgets";
import SignUpPrompt from "@/components/core-components/SignUpPrompt";
import StoreProvider from "@/redux/StoreProvider";

export const metadata: Metadata = {
  title: "My ChatMAX",
  description: "Created using NextJS",
  icons: {
    icon: "/assets/Logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col text-black dark:bg-gray-950 dark:text-white bg-[url('/assets/BG.png')] bg-fixed bg-cover bg-no-repeat">
        <StoreProvider>
          <div className="flex min-h-screen max-w-360 w-full self-center bg-transparent">
            <Sidebar />
            {children}
            {/* <Widgets /> */}
          </div>
          <SignUpPrompt />
        </StoreProvider>
      </body>
    </html>
  );
}
