import React, { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { lockProject } from "../../services/projectSecurityService";

export const ProjectLockBadge: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Oculto em viewports mobile (< 1024px) para nunca sobrepor o header ou sacola do app
  return (
    <div className="hidden lg:block fixed bottom-4 left-4 z-50 pointer-events-auto">
      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 border border-white/10 hover:border-[#F6C945]/40 backdrop-blur-md text-[10px] font-semibold text-slate-300 hover:text-white transition-all shadow-md group cursor-pointer"
          title="Projeto protegido por senha. Clique para trancar novamente."
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400 group-hover:hidden" />
          <Lock className="w-3 h-3 text-[#F6C945] hidden group-hover:block" />
          <span>Ambiente Homologado</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#141719] border border-amber-500/40 backdrop-blur-lg shadow-xl text-[10px] animate-in fade-in zoom-in-95">
          <span className="px-2 text-slate-300 font-medium">Trancar acesso?</span>
          <button
            type="button"
            onClick={lockProject}
            className="px-2 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold transition-colors cursor-pointer"
          >
            Trancar
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 font-medium transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectLockBadge;
