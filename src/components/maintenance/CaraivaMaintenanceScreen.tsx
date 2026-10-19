import React, { useState, useEffect } from "react";
import { Wrench, ShieldAlert, Sparkles, Clock, Lock, KeyRound, ArrowRight } from "lucide-react";

interface CaraivaMaintenanceScreenProps {
  onUnlock?: () => void;
}

export const CaraivaMaintenanceScreen: React.FC<CaraivaMaintenanceScreenProps> = ({ onUnlock }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [secretPass, setSecretPass] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const updateTime = () => {
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
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSecretUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretPass === "nxa2026" || secretPass === "caraiva" || secretPass === "admin") {
      sessionStorage.setItem("caraiva_maintenance_bypass", "true");
      localStorage.setItem("caraiva_maintenance_bypass", "true");
      if (onUnlock) {
        onUnlock();
      } else {
        window.location.reload();
      }
    } else {
      setErrorMsg("Chave de liberação incorreta.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleLogoTripleClick = () => {
    const next = clickCount + 1;
    if (next >= 3) {
      setShowAdminModal(true);
      setClickCount(0);
    } else {
      setClickCount(next);
      setTimeout(() => setClickCount(0), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090A] text-[#FFF4ED] flex flex-col justify-between items-center p-6 sm:p-10 relative overflow-hidden select-none font-sans">
      {/* Luzes de fundo atmosféricas Dark Luxury */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-[#F6C945]/10 via-[#FF8A3D]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header com Status & Horário da Vila */}
      <header className="w-full max-w-2xl flex items-center justify-between z-10 border-b border-white/5 pb-4">
        <div 
          onClick={handleLogoTripleClick}
          className="cursor-pointer group flex items-center gap-2.5 transition active:scale-95"
          title="Caraíva Digital (clique 3x para acesso técnico)"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F6C945] to-[#FFAE33] p-0.5 shadow-[0_0_20px_rgba(246,201,69,0.3)] flex items-center justify-center">
            <div className="w-full h-full bg-[#07090A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F6C945]" />
            </div>
          </div>
          <div>
            <span style={{ fontFamily: "'Kaushan Script', cursive" }} className="text-xl text-white">Caraíva</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#38BDF8] ml-1.5">DIGITAL</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-[#F6C945]" />
          <span className="font-mono text-[11px] text-[#FFF4ED]">{currentTime || "Horário da Vila"}</span>
          <span className="text-[10px] text-slate-500">• BA</span>
        </div>
      </header>

      {/* Conteúdo Central: Estado Offline & Calibração */}
      <main className="w-full max-w-lg mx-auto my-auto z-10 flex flex-col items-center text-center py-10 space-y-6">
        {/* Badge Pulsante de Pausa / Manutenção */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Sistema Temporariamente Indisponível</span>
        </div>

        {/* Ícone Esculpido de Ferramentas / Cadeado */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#141719] via-[#1E2328] to-[#0E1215] border border-white/10 flex items-center justify-center shadow-2xl shadow-black/80">
            <Wrench className="w-10 h-10 text-[#F6C945] stroke-[1.75]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#07090A] border border-amber-500/40 flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Textos de Aviso */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ambiente em Manutenção Programada
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            Estamos aplicando melhorias na infraestrutura e realizando a sincronização de dados do ecossistema. O acesso às telas públicas e de negócios está pausado no momento.
          </p>
        </div>

        {/* Cards de Status de Operação */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Estado dos Servidores</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Modo Restrito de Segurança</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Previsão</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Retorno em Breve</span>
            </div>
          </div>
        </div>

        {/* Botão sutil para desbloqueio autorizado */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowAdminModal(true)}
            className="inline-flex items-center gap-2 text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Acesso restrito para administradores</span>
          </button>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="w-full max-w-2xl border-t border-white/5 pt-4 text-center z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
        <span>© Caraíva Digital 2026 • Reserva Extrativista</span>
        <span>Tecnologia & Experiência Nativa • Bahia</span>
      </footer>

      {/* Modal de Acesso Técnico / Desenvolvedor */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141719] border border-white/15 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <KeyRound className="w-4 h-4 text-[#F6C945]" />
                <span>Liberação Técnica</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Digite a chave de desenvolvedor para ignorar o modo de manutenção temporário neste navegador.
            </p>

            <form onSubmit={handleSecretUnlock} className="space-y-3">
              <input
                type="password"
                value={secretPass}
                onChange={(e) => setSecretPass(e.target.value)}
                placeholder="Chave de acesso"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#F6C945]"
              />

              {errorMsg && (
                <p className="text-[11px] text-rose-400 font-semibold">{errorMsg}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#F6C945] hover:bg-[#FFAE33] text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span>Liberar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaraivaMaintenanceScreen;
