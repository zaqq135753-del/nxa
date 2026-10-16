import type { MapCluster } from "../../../services/maps/liveMapModel";
const glyphs: Record<string,string> = {restaurantes:"🍽",bares:"🍹",cafes:"☕",hospedagens:"🏨",praias:"🏖",passeios:"🚤",noite:"♫",lojas:"◈",pontos:"✦"};
export function orbLabel(cluster: MapCluster) {
  if (cluster.points.length > 1) return `Explorar grupo de ${cluster.points.length} lugares`;
  const p = cluster.points[0];
  return `${p.business.name} — ${p.open ? "aberto no cadastro" : "fechado no cadastro"}${p.recommended ? " — salvo" : ""}`;
}
// SVG values are controlled glyphs/numbers/colors, never untrusted business text.
export function orbSvg(cluster: MapCluster, selectedId?: string) {
  const p = cluster.points[0], grouped = cluster.points.length > 1;
  const selected = !grouped && p.business.id === selectedId;
  const colors:Record<string,string>={restaurantes:'#f2a443',bares:'#f2a443',cafes:'#d6af70',hospedagens:'#4ce0ca',praias:'#89dd74',passeios:'#73c9ed',noite:'#cf9cf1',lojas:'#f1c67d'};
  const color=selected?'#f6d54d':grouped?'#b0e6d9':colors[p.business.category]??'#6ee7cf';
  const label=grouped?String(cluster.points.length):glyphs[p.business.category]??'✦';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="62" viewBox="0 0 52 62"><path d="M26 57C20 48 5 35 5 25a21 21 0 1 1 42 0c0 10-15 23-21 32Z" fill="#081f25" stroke="${color}" stroke-width="${selected?3.5:2}"/><circle cx="26" cy="25" r="16" fill="${color}" opacity=".14"/><text x="26" y="31" text-anchor="middle" font-size="${grouped?18:19}" font-family="Arial,sans-serif" font-weight="700" fill="${color}">${label}</text>${!grouped&&p.recommended?'<circle cx="43" cy="9" r="5" fill="#f6d54d" stroke="#081f25" stroke-width="2"/>':''}</svg>`;

}
export function createOrbButton(cluster: MapCluster, selectedId: string | undefined, onClick: () => void) {
  const button = document.createElement("button");
  button.type = "button"; button.className = "clm-orb";
  button.dataset.clusterSize = String(cluster.points.length);
  button.dataset.pointId = cluster.points.length === 1 ? cluster.points[0].business.id : "cluster";
  button.setAttribute("aria-label",orbLabel(cluster));
  button.setAttribute("aria-pressed",String(cluster.points.length === 1 && cluster.points[0].business.id === selectedId));
  button.innerHTML = orbSvg(cluster,selectedId);
  button.addEventListener("click",onClick);
  return button;
}
