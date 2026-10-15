import type { Metadata, Viewport } from "next";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import "./globals.css";

// Fontes locais/sistema eliminam qualquer lentidão de download do Google Fonts
const display = { variable: "font-serif" };
const sans = { variable: "font-sans" };

export const metadata: Metadata = {
  title: "Caraíva Business · Operações",
  description: "Painel de operação para pedidos, reservas, estoque e serviços recebidos pelo Caraíva Digital.",
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
      <body className="grain min-h-dvh overflow-x-hidden font-sans selection:bg-mata-400/30 selection:text-mata-100">
        <DemoSwitcher />
        <div className="relative z-10 w-full min-w-0 overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
