import { useEffect, useId, useMemo, useRef, useState } from "react";
import { asset } from "../../../lib/asset";
import { clusterLiveMapPoints, type LiveMapEngineProps } from "../../../services/maps/liveMapModel";
import { orbLabel,orbSvg } from "./mapOrb";
type Camera={x:number;y:number;scale:number};
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
export default function IllustratedMap(props: LiveMapEngineProps) {
 const host=useRef<HTMLDivElement>(null);const help=useId();
 const [size,setSize]=useState({width:400,height:600});
 const [camera,setCamera]=useState<Camera>({x:50,y:50,scale:1});const cameraRef=useRef(camera);
 const pointers=useRef(new Map<number,{x:number;y:number}>());
 const gesture=useRef<{camera:Camera;middle:{x:number;y:number};distance:number}|null>(null);
 const portrait=size.width<size.height*.9;const aspect=portrait?1.4:.7;
 const baseWidth=Math.max(size.width,size.height/aspect);const fit=Math.min(size.width/baseWidth,size.height/(baseWidth*aspect));
 const commit=(next:Camera)=>{cameraRef.current=next;setCamera(next);};
 const anchored=(initial:Camera,scale:number,from:{x:number;y:number},to=from):Camera=>{
  const width=baseWidth*initial.scale,height=width*aspect,nextWidth=baseWidth*scale;
  const worldX=initial.x/100+(from.x-size.width/2)/width,worldY=initial.y/100+(from.y-size.height/2)/height;
  return {scale,x:clamp((worldX-(to.x-size.width/2)/nextWidth)*100,0,100),y:clamp((worldY-(to.y-size.height/2)/(nextWidth*aspect))*100,0,100)};
 };
 const startGesture=()=>{const values=[...pointers.current.values()];if(!values.length){gesture.current=null;return;}const middle=values.length===1?values[0]:{x:(values[0].x+values[1].x)/2,y:(values[0].y+values[1].y)/2};gesture.current={camera:cameraRef.current,middle,distance:values.length===1?0:Math.hypot(values[1].x-values[0].x,values[1].y-values[0].y)};};
 useEffect(()=>{let first=true;const observer=new ResizeObserver(([entry])=>{const {width,height}=entry.contentRect;setSize({width,height});if(first&&width&&height){first=false;const a=width<height*.9?1.4:.7,b=Math.max(width,height/a);commit({x:50,y:50,scale:a===1.4?Math.min(width/b,height/(b*a)):1});}});if(host.current)observer.observe(host.current);props.onReady();return()=>observer.disconnect();},[]);
 const orientation=useRef(portrait);
 useEffect(()=>{if(orientation.current===portrait)return;orientation.current=portrait;const selected=props.points.find(point=>point.business.id===props.selectedId);commit(selected?{x:selected.business.coordinates.x,y:selected.business.coordinates.y,scale:1.15}:{x:50,y:50,scale:portrait?fit:1});},[portrait]);
 const width=baseWidth*camera.scale,height=width*aspect,left=size.width/2-camera.x/100*width,top=size.height/2-camera.y/100*height;
 const clusters=useMemo(()=>clusterLiveMapPoints(props.points,p=>({x:p.business.coordinates.x/100*width,y:p.business.coordinates.y/100*height}),props.selectedId,64),[props.points,props.selectedId,width,height]);
 useEffect(()=>{const selected=props.points.find(point=>point.business.id===props.selectedId);if(selected)commit({...cameraRef.current,x:selected.business.coordinates.x,y:selected.business.coordinates.y,scale:Math.max(1.15,cameraRef.current.scale)});},[props.selectedId]);
 useEffect(()=>{const previous=cameraRef.current;if(props.command.reset)commit({x:50,y:50,scale:fit});else if(props.command.zoomBy)commit({...previous,scale:clamp(previous.scale*2**(props.command.zoomBy??0),fit,8)});},[props.command]);
 useEffect(()=>{const element=host.current;if(!element)return;const wheel=(event:WheelEvent)=>{event.preventDefault();const rect=element.getBoundingClientRect();const previous=cameraRef.current;commit(anchored(previous,clamp(previous.scale*Math.exp(-event.deltaY*.002),fit,8),{x:event.clientX-rect.left,y:event.clientY-rect.top}));};element.addEventListener('wheel',wheel,{passive:false});return()=>element.removeEventListener('wheel',wheel);},[size.width,size.height,baseWidth,fit]);
 return <div ref={host} className="clm-engine clm-illustrated" tabIndex={0} role="region" aria-label="Mapa ilustrado de Caraíva — posições aproximadas" aria-describedby={help}
 onKeyDown={event=>{if(event.target!==event.currentTarget)return;const previous=cameraRef.current;const pan=8/previous.scale;const directions:Record<string,[number,number]>={ArrowLeft:[-pan,0],ArrowRight:[pan,0],ArrowUp:[0,-pan],ArrowDown:[0,pan]};if(directions[event.key]){event.preventDefault();const [x,y]=directions[event.key];commit({...previous,x:clamp(previous.x+x,0,100),y:clamp(previous.y+y,0,100)});}else if(['+','=','-','Home'].includes(event.key)){event.preventDefault();commit(event.key==='Home'?{x:50,y:50,scale:fit}:{...previous,scale:clamp(previous.scale*(event.key==='-'?.8:1.25),fit,8)});}}}
 onPointerDown={event=>{if((event.target as Element).closest('button')||event.button>0)return;const rect=event.currentTarget.getBoundingClientRect();pointers.current.set(event.pointerId,{x:event.clientX-rect.left,y:event.clientY-rect.top});event.currentTarget.setPointerCapture(event.pointerId);startGesture();}}
 onPointerMove={event=>{if(!pointers.current.has(event.pointerId)||!gesture.current)return;const rect=event.currentTarget.getBoundingClientRect();pointers.current.set(event.pointerId,{x:event.clientX-rect.left,y:event.clientY-rect.top});const values=[...pointers.current.values()],initial=gesture.current;const middle=values.length===1?values[0]:{x:(values[0].x+values[1].x)/2,y:(values[0].y+values[1].y)/2};const distance=values.length===1?0:Math.hypot(values[1].x-values[0].x,values[1].y-values[0].y);const scale=initial.distance>0?clamp(initial.camera.scale*distance/initial.distance,fit,8):initial.camera.scale;commit(anchored(initial.camera,scale,initial.middle,middle));}}
 onPointerUp={event=>{pointers.current.delete(event.pointerId);startGesture();}} onPointerCancel={event=>{pointers.current.delete(event.pointerId);startGesture();}} onLostPointerCapture={event=>{pointers.current.delete(event.pointerId);startGesture();}}
 onDoubleClick={event=>{if((event.target as Element).closest('button'))return;const rect=event.currentTarget.getBoundingClientRect();commit(anchored(cameraRef.current,clamp(cameraRef.current.scale*1.4,fit,8),{x:event.clientX-rect.left,y:event.clientY-rect.top}));}}>
 <img className="clm-village-illustration" src={asset(portrait?"assets/route/caraiva-tropical-map-portrait.svg":"assets/route/caraiva-tropical-map.svg")} alt="" draggable={false} style={{width,height,left,top}}/>
 {clusters.map(cluster=><button type="button" className="clm-orb" key={cluster.id} data-category={cluster.points[0].business.category} data-cluster-size={cluster.points.length} data-point-id={cluster.points.length===1?cluster.points[0].business.id:'cluster'} aria-label={orbLabel(cluster)} aria-pressed={cluster.points.length===1&&cluster.points[0].business.id===props.selectedId} style={{left:left+cluster.x,top:top+cluster.y}} onClick={()=>{if(cluster.points.length===1)props.onSelect(cluster.points[0]);else commit({x:cluster.points.reduce((sum,p)=>sum+p.business.coordinates.x,0)/cluster.points.length,y:cluster.points.reduce((sum,p)=>sum+p.business.coordinates.y,0)/cluster.points.length,scale:Math.min(8,cameraRef.current.scale*1.8)});}} dangerouslySetInnerHTML={{__html:orbSvg(cluster,props.selectedId)}}/>)}
 <p id={help} className="clm-sr-only">Arraste para explorar. Use pinça ou roda do mouse para zoom. Com o mapa focado, use setas, mais, menos ou Home.</p><p className="clm-illustration-credit">Ilustração da vila · posições aproximadas</p>
 </div>;
}
