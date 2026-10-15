import type {Place} from './campus';
export const shortName=(p:Place)=>({'teaching-north':'教学北门','residence-south':'生活南门','residence-east':'生活东门',south:'教学南门',east:'教学东门',a:'A 栋',b:'B 栋',library:'C 栋 · 图书馆',d:'D 栋',e:'E 栋',j:'J 栋',museum:'美术馆',bridge:'连接天桥',field:'田径场',gardens:'楼间花园',auditorium900:'九百座报告厅',canteen:'食堂',basketball:'篮球南场','basketball-north':'篮球北场','west-courts':'综合球场'}[p.id]??p.name.replace('教学区','').replace('生活区','').replace('留学生公寓 · ','宿舍 '));

