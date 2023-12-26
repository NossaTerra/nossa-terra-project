import "~/styles/globals.css";

import { Inter as Inter, Poppins } from "next/font/google";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${fontInter.variable} ${fontPoppins.variable} bg-backgroundPrimary`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
