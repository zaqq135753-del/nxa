"use client";
import { useEffect, useState } from "react";
import { byId, nfcTags, type NfcTag } from "@/lib/data";

const KEY = "caraiva-tag";

/** Lembra de qual plaquinha o turista veio (pousada/quarto ou mesa) para preencher endereço e atribuir comissão. */
export function useTagContext(fromUrl?: string | null) {
  const [tag, setTag] = useState<NfcTag | null>(null);
  useEffect(() => {
    if (fromUrl) localStorage.setItem(KEY, fromUrl);
    const id = fromUrl ?? localStorage.getItem(KEY);
    setTag(id ? byId(nfcTags, id) ?? null : null);
  }, [fromUrl]);
  return tag;
}
