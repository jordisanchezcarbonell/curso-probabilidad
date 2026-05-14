import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Curso de Probabilidad desde Cero | Stat 110",
  description:
    "Curso visual en español basado en Statistics 110: Probability. Probabilidad, conteo, variables aleatorias, distribuciones, CLT y cadenas de Markov.",
};

export const viewport: Viewport = {
  themeColor: "#f7f3ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-slate-950 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-white"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
