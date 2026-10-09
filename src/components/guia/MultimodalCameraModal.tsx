import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, X, Sparkles, RotateCcw, Share2, MessageCircle, Trophy } from "lucide-react";
import { analyzeCaraivaPhoto, type PhotoAnalysisResult } from "../../services/caraivaAiService";

interface MultimodalCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onPostCreatedStory?: (story: { caption: string; image: string; stickerText: string }) => void;
}

export const MultimodalCameraModal: React.FC<MultimodalCameraModalProps> = React.memo(({
  isOpen,
  onClose,
  onShowToast,
  onPostCreatedStory,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setStreamError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Câmera não suportada neste navegador.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setStreamError("Câmera indisponível no dispositivo. Use o botão abaixo para enviar foto da galeria.");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setAnalysisResult(null);
      startCamera();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  const handleCaptureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        stopStream();
        setCapturedImage(dataUrl);
        runAiAnalysis(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      stopStream();
      setCapturedImage(dataUrl);
      runAiAnalysis(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runAiAnalysis = async (dataUrl: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCaraivaPhoto(dataUrl);
      setAnalysisResult(result);
      onShowToast(`🎉 Foto analisada com sucesso pela IA de Caraíva! (+${result.ptsEarned} pts)`);
    } catch {
      onShowToast("Erro ao analisar imagem. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  };

  const handlePublishStory = () => {
    if (!capturedImage || !analysisResult) return;
    onPostCreatedStory?.({
      caption: `${analysisResult.title} - ${analysisResult.description}`,
      image: capturedImage,
      stickerText: `✨ ${analysisResult.title}`,
    });
    onShowToast("Publicado nos Stories do Guia Caraíva! 📸");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col justify-between max-w-md mx-auto p-4 animate-in fade-in duration-500 overflow-hidden"
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between text-white z-20 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/30 border border-amber-300/50 flex items-center justify-center text-amber-300">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-white leading-tight">
              Câmera IA Multimodal
            </h3>
            <span className="text-[10px] text-zinc-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Visão GPT-4o · Caraíva Realtime
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition caraiva-press-3d"
          aria-label="Fechar Câmera"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewfinder / Result Area */}
      <div className="relative flex-1 my-3 rounded-3xl overflow-hidden caraiva-card-3d flex items-center justify-center bg-zinc-950 border border-white/30 shadow-2xl">
        {!capturedImage ? (
          <>
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Viewfinder 3D HUD Reticle */}
            <div className="absolute inset-8 pointer-events-none border border-white/40 rounded-2xl flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <span className="w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                <span className="w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 shadow">
                  Aponte para prato, praia ou local
                </span>
              </div>
              <div className="flex justify-between">
                <span className="w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-amber-400" />
              </div>
            </div>

            {streamError && (
              <div className="absolute inset-0 bg-black/70 p-6 flex flex-col items-center justify-center text-center text-white space-y-3">
                <Camera className="w-12 h-12 text-amber-400 opacity-60" />
                <p className="text-xs text-zinc-300">{streamError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-lg caraiva-press-3d"
                >
                  Enviar Foto da Galeria
                </button>
              </div>
            )}
          </>
        ) : (
          /* Captured Preview Image */
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captura de Caraíva"
              className="w-full h-full object-cover"
            />

            {/* AI Analysis Overlay Card */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-amber-400/30 border-2 border-amber-400 flex items-center justify-center animate-spin">
                  <Sparkles className="w-7 h-7 text-amber-300" />
                </div>
                <h4 className="font-serif font-bold text-base text-amber-200">
                  Analisando Foto com Visão GPT-4o...
                </h4>
                <p className="text-xs text-zinc-300 max-w-xs">
                  Reconhecendo o prato, ingredientes locais e conferindo marés e estabelecimentos de Caraíva.
                </p>
              </div>
            )}

            {/* AI Diagnosis Result Sheet */}
            {analysisResult && !isAnalyzing && (
              <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-2xl text-zinc-900 rounded-3xl p-4 shadow-2xl border border-white space-y-3 animate-in slide-in-from-bottom duration-500 max-h-[70%] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                      {analysisResult.identifiedCategory}
                    </span>
                    <h4 className="font-serif font-bold text-base text-zinc-900 leading-tight">
                      {analysisResult.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                      +{analysisResult.ptsEarned} pts
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-700 leading-snug">
                  {analysisResult.description}
                </p>

                {/* Secret Chef Tip */}
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Dica Secreta da Vila:
                  </span>
                  <p className="text-[11px] text-zinc-700 italic">
                    "{analysisResult.secretChefTip}"
                  </p>
                </div>

                {/* Reward Alert */}
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-[11px] font-semibold text-emerald-900">
                  <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{analysisResult.rewardText}</span>
                </div>

                {/* Matched Spot Card & Actions */}
                {analysisResult.matchedSpot && (
                  <div className="flex items-center justify-between p-2 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center gap-2">
                      <img
                        src={analysisResult.matchedSpot.image}
                        alt={analysisResult.matchedSpot.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-xs text-zinc-900 block">
                          {analysisResult.matchedSpot.name}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {analysisResult.matchedSpot.distanceSteps} passos na areia
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const text = `Olá equipe do ${analysisResult.matchedSpot?.name}! A IA do Guia Caraíva reconheceu sua foto e liberou meu benefício VIP.`;
                        window.open(`https://wa.me/${analysisResult.matchedSpot?.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
                      }}
                      className="py-1.5 px-3 bg-[#1C3F38] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow caraiva-press-3d"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handlePublishStory}
                    className="py-2.5 px-3 bg-[#E28444] hover:bg-[#c97135] text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow caraiva-press-3d"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Postar no Guia</span>
                  </button>

                  <button
                    onClick={handleRetake}
                    className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 caraiva-press-3d"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tirar Outra</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden File Input for Gallery Fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Bottom Controls Bar */}
      <div className="z-20 flex items-center justify-around px-4 pb-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition caraiva-press-3d"
          title="Galeria"
        >
          <span className="text-sm">🖼️</span>
        </button>

        {/* Big 3D Shutter Button */}
        {!capturedImage ? (
          <button
            onClick={handleCaptureFrame}
            className="w-18 h-18 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.6)] caraiva-press-3d"
            aria-label="Tirar Foto"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-zinc-900 border-2 border-white/60">
              <Camera className="w-7 h-7 text-amber-600" />
            </div>
          </button>
        ) : (
          <button
            onClick={handleRetake}
            className="px-5 py-3 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md transition caraiva-press-3d flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Foto</span>
          </button>
        )}

        <button
          onClick={() => onShowToast("Dica: A IA analisa tanto pratos de comida quanto paisagens do Rio e Praia!")}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition caraiva-press-3d"
          title="Ajuda IA"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </div>
  );
});

export default MultimodalCameraModal;
