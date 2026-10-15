import type {Place} from './campus';
export function inZone(place:Place,zone:string){
 if(zone==='all'||place.id==='bridge')return true;
 if(place.zone.startsWith('教学区')||place.id==='gardens')return zone==='teaching';
 if(place.zone.startsWith('生活区'))return zone==='residential';
 return zone==='teaching'?place.z>=-15:place.z< -15;
}
