import React, { useState } from "react";
import { CaraivaNfcPresentationCard } from "./CaraivaNfcPresentationCard";
import { CaraivaInstantOnboardingModal, type InstantBusinessData } from "./CaraivaInstantOnboardingModal";
import { CaraivaRealtimeWorldBuilder3D } from "./CaraivaRealtimeWorldBuilder3D";
import { CaraivaBusinessLiveReveal } from "./CaraivaBusinessLiveReveal";

interface CaraivaMagicOnboardingExperienceProps {
  onClose?: () => void;
  onExploreMap?: () => void;
  onOpenDashboard?: () => void;
  inviteCode?: string;
  repName?: string;
}

type OnboardingState = "form" | "building" | "reveal" | "presentation";

export const CaraivaMagicOnboardingExperience: React.FC<CaraivaMagicOnboardingExperienceProps> = ({
  onClose,
  onExploreMap,
  onOpenDashboard,
  inviteCode = "CARAIVA-2026-VIP",
  repName = "Consultor Oficial Caraíva Digital",
}) => {
  // Inicia direto no formulário para edição imediata de todos os campos
  const [currentState, setCurrentState] = useState<OnboardingState>("form");
  const [businessData, setBusinessData] = useState<InstantBusinessData | null>(null);

  const handleStartOnboarding = () => {
    setCurrentState("form");
  };

  const handleStartBuilding = (data: InstantBusinessData) => {
    setBusinessData(data);
    setCurrentState("building");
  };

  const handleBuildingComplete = () => {
    setCurrentState("reveal");
  };

  const handleRestart = () => {
    setCurrentState("form");
    setBusinessData(null);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      {/* Botão de Alternância Opcional para ver o Cartão de Apresentação NFC */}
      {currentState === "form" && (
        <div className="w-full max-w-xl flex justify-end mb-2">
          <button
            onClick={() => setCurrentState("presentation")}
            className="text-xs text-[#F6C945] hover:underline flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
          >
            <span>Ver Cartão de Madeira NFC & QR Code</span>
            <span>↗</span>
          </button>
        </div>
      )}

      {/* Estado 1: Apresentação com Cartão de Madeira NFC & QR Code (Opcional) */}
      {currentState === "presentation" && (
        <div className="w-full flex flex-col items-center">
          <button
            onClick={() => setCurrentState("form")}
            className="mb-4 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#FFF4ED] transition-colors"
          >
            ← Voltar para Edição do Estabelecimento
          </button>
          <CaraivaNfcPresentationCard
            onStartOnboarding={handleStartOnboarding}
            inviteCode={inviteCode}
            repName={repName}
          />
        </div>
      )}

      {/* Estado 2: Formulário Direto de 3 Passos para Edição Completa */}
      <CaraivaInstantOnboardingModal
        isOpen={currentState === "form"}
        onClose={() => {
          if (onClose) onClose();
        }}
        onStartBuilding={handleStartBuilding}
        initialInviteCode={inviteCode}
      />

      {/* Estado 3: Construção Procedural em 3D ao Vivo */}
      {currentState === "building" && businessData && (
        <CaraivaRealtimeWorldBuilder3D
          businessName={businessData.name}
          category={businessData.category}
          onComplete={handleBuildingComplete}
          onSkip={handleBuildingComplete}
        />
      )}

      {/* Estado 4: Revelação Triunfante com Prato Flutuante & Mesa 01 */}
      {currentState === "reveal" && businessData && (
        <CaraivaBusinessLiveReveal
          businessData={businessData}
          onExploreMap={() => {
            if (onExploreMap) onExploreMap();
            else if (onClose) onClose();
          }}
          onOpenDashboard={() => {
            if (onOpenDashboard) onOpenDashboard();
            else if (onClose) onClose();
          }}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};
