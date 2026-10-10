import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Compass, Crosshair, Layers, List, Minus, Plus, Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { CARAIVA_EVENTS, type Business } from "../../../data/caraivaDigitalData";
import { getFavorites } from "../../../services/favoritesService";
import { useUserLocation } from "../../../services/maps/geolocation";
import { isGoogleMapsConfigured } from "../../../services/maps/googleMapsLoader";
import { adaptLiveMapPoints, DEFAULT_MAP_FILTERS, filterLiveMapPoints, preferLightMap, type LiveMapCategory, type LiveMapMode, type LiveMapPoint, type MapCameraCommand } from "../../../services/maps/liveMapModel";
import { asset } from "../../../lib/asset";
import "./live-map.css";
import "./cartoon-map.css";
import { GuideMapSelection } from "./GuideMapSelection";

const Google3DMap = lazy(() => import("./Google3DMap"));
const Google2DMap = lazy(() => import("./Google2DMap"));
const IllustratedMap = lazy(() => import("./IllustratedMap"));
const categories: {id: LiveMapCategory; label: string}[] = [
  {id:"todos",label:"Todos"},{id:"para_mim",label:"✦ Para mim"},{id:"comer",label:"🍽 Comer"},
  {id:"agora",label:"♫ Agora"},{id:"praias",label:"🏖 Praias"},{id:"passeios",label:"🚤 Passeios"},{id:"hospedar",label:"🏨 Hospedar"},
];

function detectCapabilities() {
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webgl = Boolean(gl); gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch { /* Renderers retain a functional lightweight fallback. */ }
  const device = navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean;effectiveType?:string}};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {webgl,light:preferLightMap({...device.connection,deviceMemory:device.deviceMemory,reducedMotion,webgl})};
}

class EngineBoundary extends Component<{children:ReactNode;onError:(reason:string)=>void},{failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  componentDidCatch() { this.props.onError("Não foi possível carregar esta base de mapa."); }
  render() { return this.state.failed ? <p className="clm-loading">A base do mapa está indisponível.</p> : this.props.children; }
}

export default function CaraivaLiveMap({businesses,selectedBusiness,onSelectBusiness,onOpenBusiness,onHome}: {
  businesses:Business[];selectedBusiness?:Business|null;onSelectBusiness?:(business:Business)=>void;onOpenBusiness?:(business:Business)=>void;onHome:()=>void;
}) {
  const [capabilities] = useState(detectCapabilities);
  const [mode,setMode] = useState<LiveMapMode>("illustrated");
  const [filters,setFilters] = useState(DEFAULT_MAP_FILTERS);
  const [selectedId,setSelectedId] = useState<string|undefined>(selectedBusiness?.id);
  const [favorites,setFavorites] = useState(getFavorites);
  const [now,setNow] = useState(Date.now);
  const [loading,setLoading] = useState(true);
  const [notice,setNotice] = useState("");
  const [listOpen,setListOpen] = useState(()=>matchMedia("(min-width:1024px) and (min-height:780px)").matches);
  const [filtersOpen,setFiltersOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const filterDialog = useRef<HTMLDialogElement>(null);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const [command,setCommand] = useState<MapCameraCommand>({id:0});
  const location = useUserLocation();
  const userPosition = location.isDefault ? undefined : location.coords;
  const points = useMemo(() => adaptLiveMapPoints(businesses,CARAIVA_EVENTS,favorites,userPosition,now),[businesses,favorites,userPosition,now]);
  const visible = useMemo(() => filterLiveMapPoints(points,filters),[points,filters]);
  const selected = visible.find(point => point.business.id === selectedId);
  const activeFilterCount = Number(filters.category !== "todos") + Number(filters.openOnly) + Number(filters.nearbyOnly) + Number(filters.maxPrice < 4);
  const modeLabel = mode === "3d" ? "Google 3D" : mode === "2d" ? "Satélite" : "Ilustrado";
  useEffect(()=>{const element=root.current,toolbar=element?.querySelector<HTMLElement>('.clm-toolbar');if(!element||!toolbar)return;const observer=new ResizeObserver(()=>element.style.setProperty('--clm-toolbar-height',toolbar.getBoundingClientRect().height+'px'));observer.observe(toolbar);return()=>observer.disconnect();},[]);
  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = filterDialog.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
      if (previous?.isConnected) previous.focus({preventScroll:true}); else filterTrigger.current?.focus({preventScroll:true});
    };
  }, [filtersOpen]);

  useEffect(()=>{const desktop=matchMedia('(min-width:1024px) and (min-height:780px)');const sync=(event:MediaQueryListEvent)=>setListOpen(event.matches);desktop.addEventListener('change',sync);return()=>desktop.removeEventListener('change',sync);},[]);
  useEffect(() => {
    const original = document.body.style.overflow; document.body.style.overflow = "hidden";
    const timer = window.setInterval(() => setNow(Date.now()),60_000);
    const onFavorites = () => setFavorites(getFavorites());
    window.addEventListener("caraiva:favorites-updated",onFavorites);
    return () => { document.body.style.overflow = original; window.clearInterval(timer); window.removeEventListener("caraiva:favorites-updated",onFavorites); };
  },[]);
  useEffect(() => { setSelectedId(selectedBusiness?.id); },[selectedBusiness?.id]);
  useEffect(() => { if (selectedId && !visible.some(p => p.business.id === selectedId)) setSelectedId(undefined); },[visible,selectedId]);
  useEffect(() => {
    if (location.isDefault) {
      location.stopWatching();
      setFilters(previous => previous.nearbyOnly ? {...previous,nearbyOnly:false} : previous);
    } else location.startWatching();
    return location.stopWatching;
  },[location.isDefault,location.startWatching,location.stopWatching]);
  useEffect(() => {
    const onKey = (event:KeyboardEvent) => {
      if (event.key === "Escape" && !filtersOpen) { setListOpen(false); setSelectedId(undefined); }
    };
    window.addEventListener("keydown",onKey); return () => window.removeEventListener("keydown",onKey);
  },[filtersOpen]);

  const onReady = useCallback(() => setLoading(false),[]);
  const onError = useCallback((reason:string) => {
    setNotice(reason); setLoading(false);
    setMode(previous => previous === "3d" && isGoogleMapsConfigured() ? "2d" : "illustrated");
  },[]);
  const choose = useCallback((point:LiveMapPoint) => {
    setSelectedId(point.business.id); setListOpen(matchMedia("(min-width:1024px) and (min-height:780px)").matches); onSelectBusiness?.(point.business);
  },[onSelectBusiness]);
  const changeMode = (next:LiveMapMode) => {
    if (next === mode) return;
    setLoading(true); setNotice(""); setMode(next); setFiltersOpen(false); setListOpen(false);
  };
  const camera = (change:Omit<MapCameraCommand,"id">) => setCommand(previous => ({id:previous.id+1,...change}));
  const engineProps = {points:visible,selectedId,userPosition,command,onSelect:choose,onReady,onError};
  const Engine = mode === "3d" ? Google3DMap : mode === "2d" ? Google2DMap : IllustratedMap;

  const modeControls = (<div className="clm-modes" role="group" aria-label="Base do mapa">
          <button type="button" aria-pressed={mode === "3d"} title={capabilities.webgl ? "3D da plataforma Google, quando disponível" : "Seu navegador pode usar o modo 2D caso não libere aceleração gráfica"} onClick={() => changeMode("3d")}>Google 3D</button>
          <button type="button" aria-pressed={mode === "2d"} onClick={() => changeMode("2d")}>Satélite 2D</button>
          <button type="button" aria-pressed={mode === "illustrated"} onClick={() => changeMode("illustrated")}>Ilustrado</button>
        </div>);
  const filterControls = <><div className="clm-filter-row" role="group" aria-label="Categorias do Live Map">
        {categories.map(category => <button type="button" key={category.id} aria-pressed={filters.category === category.id} title={category.id === "para_mim" ? "Lugares salvos no seu guia" : category.label} onClick={() => setFilters(previous => ({...previous,category:category.id}))}>{category.label}</button>)}
      </div>
      <div className="clm-filter-row clm-context-filters" role="group" aria-label="Filtros do Live Map">
        <button type="button" aria-pressed={filters.openOnly} onClick={() => setFilters(previous => ({...previous,openOnly:!previous.openOnly}))}>Aberto no cadastro</button>
        <button type="button" aria-pressed={filters.nearbyOnly} disabled={!userPosition} title="Estimativa a pé em linha reta; requer GPS em Caraíva" onClick={() => setFilters(previous => ({...previous,nearbyOnly:!previous.nearbyOnly}))}>Até 5 min</button>
        <label className="clm-price">Preço<select aria-label="Faixa de preço no mapa" value={filters.maxPrice} onChange={event => setFilters(previous => ({...previous,maxPrice:Number(event.target.value)}))}><option value={4}>Todos</option><option value={1}>Até $</option><option value={2}>Até $</option><option value={3}>Até $$</option></select></label>
      </div></>;

  return <section ref={root} className="caraiva-live-map" data-mode={mode} data-selected={Boolean(selected)} aria-label="Caraíva Live Map">
    <div className="clm-scene"><EngineBoundary key={mode} onError={onError}><Suspense fallback={<div className="clm-loading"><img src={asset("assets/route/caraiva-tropical-map.svg")} alt="" /><span>Preparando seu mapa…</span></div>}><Engine {...engineProps} /></Suspense></EngineBoundary></div>
    <div className="clm-toolbar">
      <div className="clm-brand-row">
        <button type="button" className="clm-home" onClick={onHome} aria-label="Voltar ao início do guia"><ArrowLeft size={18}/><span>CARAÍVA<strong>MAPA DA VILA</strong></span></button>
        <div className="clm-desktop-modes">{modeControls}</div>
        <button type="button" className="clm-mobile-mode" aria-label="Opções e base do mapa" onClick={() => {setListOpen(false);setFiltersOpen(true);}}>{modeLabel}<ChevronDown size={14}/></button>
      </div>
      <p className="clm-tagline">Veja Caraíva acontecendo ao seu redor.</p>
      <div className="clm-search-row"><label className="clm-search"><Search size={18} aria-hidden="true"/><span className="clm-sr-only">Buscar lugares no mapa</span><input type="search" placeholder="Encontre seu lugar na vila" value={filters.query} onChange={event => setFilters(previous => ({...previous,query:event.target.value}))}/></label><button type="button" ref={filterTrigger} className="clm-filter-trigger" aria-label={`Filtros do mapa${activeFilterCount ? `, ${activeFilterCount} ativos` : ""}`} aria-haspopup="dialog" aria-expanded={filtersOpen} onClick={() => {setListOpen(false);setFiltersOpen(true);}}><SlidersHorizontal size={18}/><span>Filtros</span>{activeFilterCount > 0 && <b>{activeFilterCount}</b>}</button></div>
      {(location.isLocating || location.error) && <p className="clm-mobile-gps" role="status">{location.isLocating ? "Buscando GPS…" : "GPS indisponível · veja os detalhes em Filtros"}</p>}
      <div className="clm-desktop-filters">{filterControls}</div>
    </div>
    <div className="clm-status" role="status"><span>{loading ? "Carregando base…" : mode === "3d" ? "Visão 3D" : mode === "2d" ? "Mapa 2D" : "Modo ilustrado"}</span><span>Dados do cadastro · confirme no local</span></div>
    <div className="clm-controls" aria-label="Controles da câmera">
      <button type="button" onClick={() => camera({zoomBy:1})} aria-label="Aproximar mapa"><Plus size={19}/></button>
      <button type="button" onClick={() => camera({zoomBy:-1})} aria-label="Afastar mapa"><Minus size={19}/></button>
      <button type="button" onClick={() => camera({reset:true})} className="clm-reset-control" aria-label="Ver toda Caraíva"><Compass size={19}/></button>
      <button type="button" disabled={location.isLocating} onClick={() => { if (userPosition && mode !== "illustrated") camera({center:userPosition}); else {location.requestLocation();if(mode === "illustrated")setNotice("GPS e navegação ficam na base 2D. A ilustração mostra posições aproximadas.");} }} aria-label="Usar minha localização"><Crosshair size={19}/></button>
    </div>
    <div className="clm-location-note" role="status">{location.isLocating ? "Buscando sua localização…" : location.error || (location.isDefault ? "Referência: centro da vila · GPS não localizado" : "GPS ativo · distância estimada em linha reta")}</div>
    {notice && <p className="clm-notice">{notice}</p>}
    {!visible.length && <div className="clm-empty" role="status"><Layers size={22}/><strong>Nenhum lugar neste filtro</strong><p>{filters.category === "agora" ? "Não há eventos no intervalo atual cadastrado." : "Experimente outra categoria ou busca."}</p><button type="button" onClick={() => setFilters(DEFAULT_MAP_FILTERS)}>Mostrar todos os lugares</button></div>}
    <button type="button" className="clm-list-toggle" aria-expanded={listOpen} aria-controls={listOpen ? "clm-places" : undefined} onClick={() => setListOpen(value => !value)}><List size={17}/>{visible.length} {visible.length === 1 ? "lugar" : "lugares"}<span>{listOpen ? "Fechar" : "Ver lista"}</span></button>
    {listOpen && <div id="clm-places" className="clm-place-list" role="group" aria-label="Lugares no mapa">{visible.map(point => <button type="button" key={point.business.id} onClick={() => choose(point)}><span>{point.business.name}</span><small>{point.business.subcategory}{point.distanceMeters !== undefined ? ` · ${point.distanceMeters} m em linha reta` : ""}</small></button>)}{!visible.length && <p>Nenhum lugar neste filtro.</p>}</div>}
    {filtersOpen && <dialog ref={filterDialog} className="clm-filter-sheet" aria-labelledby="clm-filter-title" onCancel={() => setFiltersOpen(false)}>
      <div className="clm-sheet-handle" aria-hidden="true"/>
      <header><div><small>SEU JEITO DE EXPLORAR</small><h2 id="clm-filter-title">Filtros do mapa</h2></div><button type="button" className="clm-sheet-close" onClick={() => setFiltersOpen(false)} aria-label="Fechar filtros"><X size={21}/></button></header>
      <div className="clm-sheet-body"><h3>Visualização</h3>{modeControls}<h3>O que você procura?</h3>{filterControls}
      <button type="button" className="clm-sheet-reset-camera" onClick={() => {camera({reset:true});setFiltersOpen(false);}}><Compass size={18}/>Ver toda Caraíva</button>
      <div className="clm-sheet-info"><strong>Sobre este mapa</strong><p>{loading ? "Carregando base…" : mode === "3d" ? "Visão 3D" : mode === "2d" ? "Mapa 2D" : "Mapa ilustrado · posições aproximadas"}</p><p>{location.isLocating ? "Buscando sua localização…" : location.error || (location.isDefault ? "Referência: centro da vila · GPS não localizado" : "GPS ativo · distâncias e tempos estimados em linha reta")}</p><p>Dados do cadastro · confirme informações e disponibilidade no local.</p></div></div>
      <footer><button type="button" className="clm-sheet-clear" onClick={() => setFilters(previous => ({...DEFAULT_MAP_FILTERS,query:previous.query}))}>Limpar filtros</button><button type="button" className="clm-sheet-apply" onClick={() => setFiltersOpen(false)}>Ver {visible.length} {visible.length === 1 ? "lugar" : "lugares"}</button></footer>
    </dialog>}
    {selected && <GuideMapSelection illustrated={mode === "illustrated"} point={selected} onClose={()=>setSelectedId(undefined)} onOpen={onOpenBusiness?()=>onOpenBusiness(selected.business):undefined}/>}
  </section>;
}
