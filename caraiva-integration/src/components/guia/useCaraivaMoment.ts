import { useEffect, useState } from "react";

const clock = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Bahia", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export function getCaraivaMoment(date = new Date()) {
  const time = clock.format(date);
  const hour = Number(clock.formatToParts(date).find(part => part.type === "hour")?.value ?? 0);
  if (hour >= 5 && hour < 12) return { period: "morning", greeting: "Bom dia, Caraíva", invitation: "Um café, o rio e um novo caminho.", nowLabel: "Manhã na vila", time };
  if (hour >= 12 && hour < 16) return { period: "day", greeting: "No ritmo de Caraíva", invitation: "Entre o rio e o mar, encontre seu lugar.", nowLabel: "Tarde na vila", time };
  if (hour >= 16 && hour < 18) return { period: "sunset", greeting: "Fim de tarde no rio", invitation: "Desacelere e descubra a beira-rio.", nowLabel: "Fim de tarde", time };
  return { period: "night", greeting: "A noite é da vila", invitation: "Sabores, encontros e caminhos na areia.", nowLabel: "Noite na vila", time };
}

export type CaraivaMoment = ReturnType<typeof getCaraivaMoment>;

export function useCaraivaMoment() {
  const [moment, setMoment] = useState(getCaraivaMoment);
  useEffect(() => {
    const update = () => setMoment(getCaraivaMoment());
    const timer = window.setInterval(update, 30_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return moment;
}
