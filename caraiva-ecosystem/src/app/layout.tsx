import type { Metadata, Viewport } from "next";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import "./globals.css";

// Fontes locais/sistema eliminam qualquer lentidão de download do Google Fonts
const display = { variable: "font-serif" };
const sans = { variable: "font-sans" };

export const metadata: Metadata = {
  title: "Caraíva Digital · Ecossistema",
  description: "Pedidos, reservas e passeios de Caraíva em um só lugar.",
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { 
  themeColor: "#0A0D0B", 
  width: "device-width", 
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="grain min-h-dvh font-sans overflow-x-hidden selection:bg-coral-500/30 selection:text-coral-200">
        <div role="status" className="relative z-[80] bg-amber-300 px-3 py-1.5 text-center text-[10px] font-bold tracking-wide text-noite-950 sm:text-xs">
          AMBIENTE DE DEMONSTRAÇÃO · dados ficam neste navegador · pagamentos e reservas não são reais
        </div>
        <DemoSwitcher />
        <div className="relative z-10 w-full overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
