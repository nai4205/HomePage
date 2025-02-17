import type { Metadata } from "next";
import "./globals.css";
import { SideBar } from "../ui/SideBar";
import { WidgetProvider } from "@/context/WidgetContext";
import { OptionsProvider } from "@/context/OptionsContext";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OptionsProvider>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, height=device-height initial-scale=1.0" />
      </head>
      <WidgetProvider>
      <body className="bg-gray-1100 h-dvh w-dvh">
        <SideBar />
        <div className="lg:pl-72">
            <div>{children}</div>
        </div>
      </body>
      </WidgetProvider>
    </html>
    </OptionsProvider>

  );
}
