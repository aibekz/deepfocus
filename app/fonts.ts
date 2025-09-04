import { IBM_Plex_Mono, Lora } from "next/font/google";

export const lora = Lora({
  variable: "--font-lora-sans",
  subsets: ["latin"],
});

export const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});
