import { useEffect, useState, useRef } from "react";
import { ClipboardList, Compass, Radio, Store, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaraivaMoment } from "./useCaraivaMoment";
import { GuideThemeButton } from "./GuideThemeButton";
import type { GuideTheme } from "./useGuideTheme";

import { CaraivaWeatherTideWidget } from "./CaraivaWeatherTideWidget";

interface Props {
  moment: CaraivaMoment;
  audioActive: boolean;
  salesAdmin?: boolean;
  onHome: () => void;
  onAudio: () => void;
  onBusiness: () => void;
  theme: GuideTheme;
  onToggleTheme: () => void;
}

export function CaraivaLivingHeader({ moment, audioActive, salesAdmin: _salesAdmin, onHome, onAudio, onBusiness, theme, onToggleTheme }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Se rolou mais que 50px, marca como scrolled
      setIsScrolled(currentScrollY > 40);

      // Scroll para baixo: esconde; Scroll para cima: revela
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`caraiva-living-header transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 35,
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease',
      }}
    >
      <div className="caraiva-header-inner">
        <div className="caraiva-header-row">
          <button type="button" className="caraiva-brand" onClick={onHome} aria-label="Caraíva Digital — voltar ao início">
            <span className="caraiva-brand-mark"><Compass size={22} aria-hidden="true" /></span>
            <span>
              <strong>CARAÍVA <small>DIGITAL</small></strong>
              <span className="caraiva-brand-caption">Viva a vila. No seu tempo.</span>
            </span>
          </button>

          {/* Ações Essenciais Curadas: Pedidos/Sacola + Som + Business + Tema */}
          <div className="caraiva-header-actions flex items-center gap-1.5">
            {/* 1. Radar Admin (Discreto) */}
            <Link 
              className="caraiva-icon-button relative" 
              to="/admin/radar" 
              aria-label="Radar ao Vivo (Admin)" 
              title="Radar ao Vivo (Admin)"
            >
              <Radio size={18} className="text-emerald-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </Link>

            {/* 2. Meus Pedidos & Reservas */}
            <Link 
              className="caraiva-icon-button" 
              to="/guia/pedidos" 
              aria-label="Meus pedidos e reservas" 
              title="Meus pedidos e reservas"
            >
              <ClipboardList size={18} />
            </Link>

            {/* 3. Tema Claro / Escuro */}
            <GuideThemeButton theme={theme} onToggle={onToggleTheme} />

            {/* 4. Som Ambiente das Ondas de Caraíva */}
            <button 
              type="button" 
              className="caraiva-icon-button" 
              onClick={onAudio} 
              aria-pressed={audioActive} 
              aria-label={audioActive ? "Pausar som ambiente" : "Ativar som ambiente"} 
              title="Som ambiente"
            >
              {audioActive ? <Volume2 size={18} className="text-teal-400" /> : <VolumeX size={18} />}
            </button>

            {/* 5. Acesso ao Portal Business dos Comerciantes */}
            <button 
              type="button" 
              className="caraiva-icon-button" 
              onClick={onBusiness} 
              aria-label="Abrir Portal Business" 
              title="Portal Business"
            >
              <Store size={18} />
              <span className="caraiva-desktop-label">Business</span>
            </button>
          </div>
        </div>

        {/* Linha do Momento e Clima (Encolhe suavemente no scroll) */}
        {!isScrolled && (
          <div className="caraiva-moment-row animate-in fade-in duration-200">
            <div>
              <p className="caraiva-eyebrow">RIO · MAR · VILA</p>
              <h1>{moment.greeting}</h1>
              <p className="caraiva-invitation">{moment.invitation}</p>
            </div>
            <span className="caraiva-time">
              <span aria-hidden="true" className="caraiva-time-dot" />
              <time>{moment.time}</time>
              <small>em Caraíva</small>
            </span>
          </div>
        )}

        {/* Widget de Clima & Maré */}
        <CaraivaWeatherTideWidget />
      </div>
    </header>
  );
}
