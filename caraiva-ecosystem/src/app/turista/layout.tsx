import { redirect } from "next/navigation";

// Evita manter uma segunda experiência turística dentro do painel de operações.
export default function TouristRedirectLayout() {
  redirect("https://caraiva.digital/guia");
}
