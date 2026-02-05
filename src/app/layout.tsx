import { Nunito } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ClientLayout } from "@/components/ClientLayout";
import { headingFont, displayFont } from "@/fonts/custom-fonts";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dearborn Coffee Club",
  description:
    "An organization blogging app aimed at reviewing coffee shops in Dearborn, MI and awarding those who are delicious.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${headingFont.variable} ${displayFont.variable} font-sans`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
