import { Briefcase, Compass, Store, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaraivaMoment } from "./useCaraivaMoment";
import { GuideThemeButton } from "./GuideThemeButton";
import type { GuideTheme } from "./useGuideTheme";

interface Props {
  moment: CaraivaMoment;
  audioActive: boolean;
  salesAdmin: boolean;
  onHome: () => void;
  onAudio: () => void;
  onBusiness: () => void;
  theme: GuideTheme;
  onToggleTheme: () => void;
}

export function CaraivaLivingHeader({ moment, audioActive, salesAdmin, onHome, onAudio, onBusiness, theme, onToggleTheme }: Props) {
  return <header className="caraiva-living-header">
    <div className="caraiva-header-inner">
      <div className="caraiva-header-row">
        <button type="button" className="caraiva-brand" onClick={onHome} aria-label="Caraíva Digital — voltar ao início">
          <span className="caraiva-brand-mark"><Compass size={24} aria-hidden="true" /></span>
          <span><strong>CARAÍVA <small>DIGITAL</small></strong><span className="caraiva-brand-caption">Viva a vila. No seu tempo.</span></span>
        </button>
        <div className="caraiva-header-actions">
          <GuideThemeButton theme={theme} onToggle={onToggleTheme} />
          <button type="button" className="caraiva-icon-button" onClick={onAudio} aria-pressed={audioActive} aria-label={audioActive ? "Pausar som ambiente" : "Ativar som ambiente"} title="Som ambiente">
            {audioActive ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button type="button" className="caraiva-icon-button" onClick={onBusiness} aria-label="Abrir Portal Business" title="Portal Business"><Store size={19} /><span className="caraiva-desktop-label">Business</span></button>
          {salesAdmin && <Link className="caraiva-icon-button" to="/admin/sales" aria-label="Abrir área comercial" title="Área comercial"><Briefcase size={19} /></Link>}
        </div>
      </div>
      <div className="caraiva-moment-row">
        <div><p className="caraiva-eyebrow">RIO · MAR · VILA</p><h1>{moment.greeting}</h1><p className="caraiva-invitation">{moment.invitation}</p></div>
        <span className="caraiva-time"><span aria-hidden="true" className="caraiva-time-dot" /><time>{moment.time}</time><small>em Caraíva</small></span>
      </div>
    </div>
  </header>;
}
