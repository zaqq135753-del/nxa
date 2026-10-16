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

type OnboardingState = "presentation" | "form" | "building" | "reveal";

export const CaraivaMagicOnboardingExperience: React.FC<CaraivaMagicOnboardingExperienceProps> = ({
  onClose,
  onExploreMap,
  onOpenDashboard,
  inviteCode = "CARAIVA-2026-VIP",
  repName = "Consultor Oficial Caraíva Digital",
}) => {
  const [currentState, setCurrentState] = useState<OnboardingState>("presentation");
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
    setCurrentState("presentation");
    setBusinessData(null);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col items-center justify-center py-6 px-2 sm:px-4">
      {/* Estado 1: Apresentação com Cartão de Madeira NFC & QR Code */}
      {currentState === "presentation" && (
        <CaraivaNfcPresentationCard
          onStartOnboarding={handleStartOnboarding}
          inviteCode={inviteCode}
          repName={repName}
        />
      )}

      {/* Estado 2: Modal dos 3 Passos Rápidos */}
      <CaraivaInstantOnboardingModal
        isOpen={currentState === "form"}
        onClose={() => setCurrentState("presentation")}
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
