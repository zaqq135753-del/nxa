export interface TapTableLiveState { venueId:string; tableCount:number; availableTables:number; activeOrdersCount:number; currentWaitMinutes:number; supportsNfcTap:boolean; pixSplitActive:boolean; lastSyncedAt:string; verified:boolean; }
export class TapTableSyncService {
 static getLiveTableStatus(businessId:string):TapTableLiveState { return {venueId:businessId,tableCount:0,availableTables:0,activeOrdersCount:0,currentWaitMinutes:0,supportsNfcTap:false,pixSplitActive:false,lastSyncedAt:'',verified:false}; }
 static subscribeToLiveTables(callback:(states:Record<string,TapTableLiveState>)=>void):()=>void { callback({}); return ()=>{}; }
 static generateNfcDeepLink(businessId:string,tableNumber?:number):string {const params=new URLSearchParams({modo:'goods'});if(tableNumber)params.set('mesa',String(tableNumber));return '/guia/checkout/'+encodeURIComponent(businessId)+'?'+params.toString();}
 static async processInstantPixSplit(_orderId:string,_split:{partnerShare:number;platformShare:number}):Promise<{success:boolean;txHash:string;message:string}>{return {success:false,txHash:'',message:'Pagamento online ainda não configurado. Nenhuma cobrança foi feita.'};}
}
