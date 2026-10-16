import { useEffect, useRef, useState } from "react";
import { Camera, Compass, Search, Sparkles, Waves, X } from "lucide-react";
import { CaraivaLivingOrb, type OrbState } from "../experience/CaraivaLivingOrb";

export function CaraivaOrb({
  onConcierge,
  onSearch,
  onMap,
  onTides,
  onCamera,
  orbState = "thinking",
}: {
  onConcierge: () => void;
  onSearch: () => void;
  onMap: () => void;
  onTides: () => void;
  onCamera: () => void;
  orbState?: OrbState;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstAction = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstAction.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  const actions = [
    { label: "Planejar com o Concierge", Icon: Sparkles, run: onConcierge },
    { label: "Explorar a vila", Icon: Search, run: onSearch },
    { label: "Abrir o mapa 3D", Icon: Compass, run: onMap },
    { label: "Consultar clima e maré", Icon: Waves, run: onTides },
    { label: "Abrir câmera inteligente", Icon: Camera, run: onCamera },
  ];

  return (
    <div
      className="caraiva-orb"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      {open && (
        <div
          id="caraiva-orb-actions"
          className="caraiva-orb-panel"
          role="group"
          aria-label="Atalhos Caraíva Living Orb"
        >
          <p className="caraiva-eyebrow">ECOSSISTEMA CARAÍVA</p>
          <strong>Por onde vamos hoje?</strong>
          {actions.map(({ label, Icon, run }, index) => (
            <button
              type="button"
              ref={index === 0 ? firstAction : undefined}
              key={label}
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
                run();
              }}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        ref={trigger}
        className="caraiva-orb-trigger"
        aria-label={open ? "Fechar Caraíva Orb" : "Abrir Caraíva Orb"}
        aria-expanded={open}
        aria-controls={open ? "caraiva-orb-actions" : undefined}
        onClick={() => setOpen((value) => !value)}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {open ? (
          <div className="w-14 h-14 rounded-full bg-[#141719] border border-white/20 flex items-center justify-center text-[#FFF4ED] shadow-xl">
            <X size={24} />
          </div>
        ) : (
          <CaraivaLivingOrb state={orbState} size={54} />
        )}
      </button>
    </div>
  );
}
