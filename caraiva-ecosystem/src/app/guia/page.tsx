import { redirect } from "next/navigation";

// A vitrine turística oficial fica no domínio público, fora do painel Business.
export default function GuiaRedirect() {
  redirect("https://caraiva.digital/guia");
}
