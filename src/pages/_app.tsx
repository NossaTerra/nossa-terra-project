import { type AppType } from "next/app";

import { Inter as Inter, Poppins } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

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

const AppWrapper: AppType = ({ Component, pageProps }) => {
  return (
    <div
      className={`${fontInter.variable} ${fontPoppins.variable} bg-backgroundPrimary`}
    >
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(AppWrapper);
