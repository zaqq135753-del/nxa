import { redirect } from "next/navigation";

// QR codes e NFC de visitantes levam para a vitrine pública oficial.
export default function TagEntry({ params }: { params: { tagId: string } }) {
  redirect(`https://caraiva.digital/guia?tag=${encodeURIComponent(params.tagId)}`);
}
