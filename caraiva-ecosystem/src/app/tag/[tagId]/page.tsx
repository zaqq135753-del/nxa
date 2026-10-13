import { redirect } from "next/navigation";
import { byId, nfcTags } from "@/lib/data";

// URL gravada no chip NFC / QR da plaquinha: caraivadigital.com.br/tag/flor-q04
export default function TagEntry({ params }: { params: { tagId: string } }) {
  const tag = byId(nfcTags, params.tagId);
  redirect(tag ? `/turista?tag=${tag.id}` : "/turista");
}
