import { Injectable } from '@angular/core';
import {Headerinfo} from "../common/bean/headerinfo"

@Injectable()
export class countInfoService{
  updateheadInfo(data:Headerinfo,datainfo:any){
    // data.
    //   data.goodKeyBoard=datainfo.goodKeyBoard;
    //   data.stationCycle=datainfo.stationCycle;
    //   data.UPH=datainfo.UPH;
    //   data.badKeyBoard=datainfo.badKeyBoard;
    //   data.goodPer=Math.round(datainfo.goodKeyBoard/(datainfo.goodKeyBoard+datainfo.badKeyBoard)*100);
    //   data.timeConsume=datainfo.timeConsume;
    //   data.headdetail.push(data.finishKeyBoard,data.goodKeyBoard,data.stationCycle,data.UPH,data.badKeyBoard,data.goodPer,data.timeConsume);
    //   console.log(data.headdetail);
  }
}