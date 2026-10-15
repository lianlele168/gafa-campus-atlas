import {getAFloorSpaces} from './indoor-a4';
import {bFloorSpaces} from './indoor-b';
import {cFloorSpaces} from './indoor-c';
export const floorBuildingCode=(building:string)=>building==='library'?'c':building;
export const availableFloors=(building:string)=>building==='a'?[2,4]:['b','library'].includes(building)?[2,3,4,5,6,7]:[];
export const getFloorSpaces=(building:string,floor:number)=>building==='library'?(cFloorSpaces[floor]??[]):building==='b'?(bFloorSpaces[floor]??[]):building==='a'&&availableFloors(building).includes(floor)?getAFloorSpaces(floor):[];
