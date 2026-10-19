import React, { useState, useEffect } from "react";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import {
  validatePasscode,
  getSecurityStatus,
  SecurityStatus,
} from "../../services/projectSecurityService";

interface ProjectAccessGateProps {
  onUnlock: () => void;
}

export const ProjectAccessGate: React.FC<ProjectAccessGateProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>(getSecurityStatus);
  const [isShaking, setIsShaking] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Relógio do fuso da Bahia / Caraíva
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          timeZone: "America/Bahia",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer para contagem regressiva de lockout se houver
  useEffect(() => {
    if (!securityStatus.isLockedOut) return;
    const timer = setInterval(() => {
      const current = getSecurityStatus();
      setSecurityStatus(current);
      if (!current.isLockedOut) {
        clearInterval(timer);
        setErrorMsg("");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [securityStatus.isLockedOut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    // Efeito de validação com atraso perceptivo suave (anti-timing attack)
    setTimeout(() => {
      const res = validatePasscode(passcode, rememberDevice);
      if (res.success) {
        setIsSubmitting(false);
        onUnlock();
      } else {
        setIsSubmitting(false);
        setErrorMsg(res.error || "Chave incorreta.");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setSecurityStatus(getSecurityStatus());
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07090A] text-[#FFF4ED] flex flex-col justify-between items-center p-4 sm:p-8 overflow-hidden select-none font-sans">
      {/* Luzes atmosféricas Dark Luxury de estúdio */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-gradient-to-tr from-[#F6C945]/10 via-[#FF8A3D]/5 to-transparent rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-[#2DD4BF]/5 rounded-full blur-[110px]" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-80 h-80 bg-[#38BDF8]/5 rounded-full blur-[100px]" />

      {/* Header Superior: Marca & Horário Local de Caraíva */}
      <header className="w-full max-w-xl flex items-center justify-between z-10 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F6C945] to-[#FFAE33] p-0.5 shadow-[0_0_20px_rgba(246,201,69,0.25)] flex items-center justify-center">
            <div className="w-full h-full bg-[#07090A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F6C945]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold text-white tracking-tight">Caraíva</span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#38BDF8]">DIGITAL</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Ecossistema Turístico & Delivery</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-[#F6C945]" />
          <span className="font-mono text-[11px] text-[#FFF4ED]">{currentTime || "Horário da Vila"}</span>
          <span className="text-[10px] text-slate-500">• BA</span>
        </div>
      </header>

      {/* Card Principal: Gatekeeper de Acesso por Senha */}
      <main className="w-full max-w-md mx-auto my-auto z-10 flex flex-col items-center text-center py-6">
        {/* Badge Holográfica de Privacidade */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ambiente Privado & Homologado</span>
        </div>

        {/* Ícone Tátil 3D com Glow */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#141719] via-[#1E2328] to-[#0E1215] border border-white/12 flex items-center justify-center shadow-2xl shadow-black/80">
            <LockKeyhole className="w-9 h-9 text-[#F6C945] stroke-[1.8]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#07090A] border border-[#F6C945]/40 flex items-center justify-center shadow-lg">
            <KeyRound className="w-3.5 h-3.5 text-[#F6C945]" />
          </div>
        </div>

        {/* Título e Explicação */}
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Acesso Restrito ao Projeto
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Este software é confidencial e protegido contra cópia. Digite sua chave de acesso autorizada para liberar a visualização.
          </p>
        </div>

        {/* Formulário com Efeito Shake em caso de erro */}
        <form
          onSubmit={handleSubmit}
          className={`w-full space-y-4 text-left transition-transform duration-150 ${
            isShaking ? "translate-x-1 duration-75 animate-shake" : ""
          }`}
        >
          <div className="relative">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5 px-1">
              <label htmlFor="passcode-input" className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#F6C945]" />
                <span>Chave de Acesso / Senha Master</span>
              </label>
              {securityStatus.failedAttempts > 0 && !securityStatus.isLockedOut && (
                <span className="text-[10px] text-amber-400">
                  {5 - securityStatus.failedAttempts} tentativas restantes
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="passcode-input"
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                disabled={securityStatus.isLockedOut || isSubmitting}
                placeholder="Ex: caraiva2026"
                autoFocus
                autoComplete="current-password"
                className={`w-full px-4 py-3.5 pr-12 rounded-2xl bg-black/60 border text-white text-sm font-medium tracking-wide placeholder:text-slate-600 focus:outline-none transition-all shadow-inner ${
                  errorMsg
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-white/15 focus:border-[#F6C945] focus:ring-1 focus:ring-[#F6C945]/40"
                } ${securityStatus.isLockedOut ? "opacity-50 cursor-not-allowed" : ""}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                title={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Mensagem de Erro ou Bloqueio */}
            {errorMsg && (
              <div className="flex items-center gap-1.5 mt-2 px-1 text-xs text-rose-400 font-semibold animate-in fade-in">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Opção Lembrar Dispositivo */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded bg-black/50 border-white/20 text-[#F6C945] focus:ring-0 cursor-pointer accent-[#F6C945]"
              />
              <span>Lembrar este dispositivo (30 dias)</span>
            </label>
          </div>

          {/* Botão de Desbloqueio */}
          <button
            type="submit"
            disabled={securityStatus.isLockedOut || isSubmitting || !passcode.trim()}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              securityStatus.isLockedOut
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                : "bg-gradient-to-r from-[#F6C945] to-[#FFAE33] hover:from-[#FFAE33] hover:to-[#F6C945] text-slate-950 shadow-[0_0_25px_rgba(246,201,69,0.25)] active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 text-xs">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Validando Credencial...</span>
              </span>
            ) : securityStatus.isLockedOut ? (
              <span>Bloqueado temporariamente ({securityStatus.lockoutRemainingSeconds}s)</span>
            ) : (
              <>
                <span>Desbloquear Projeto</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Informações de Proteção de Propriedade Intelectual */}
        <div className="mt-8 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left w-full space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Blindagem de Código & Sigilo Comercial</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Protegido por direitos autorais. Rotas, modelos 3D, catálogo e motor de delivery estão ocultos até a autenticação formal.
          </p>
        </div>
      </main>

      {/* Rodapé com Informações de Segurança */}
      <footer className="w-full max-w-xl border-t border-white/[0.06] pt-4 text-center z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
        <span>© Caraíva Digital 2026 • Tecnologia & Inovação</span>
        <span>Acesso Monitorado • NXA Corp</span>
      </footer>
    </div>
  );
};

export default ProjectAccessGate;
