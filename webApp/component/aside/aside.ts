import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";
import { workModel } from '../../common/bean/workmodel';



@Component({
  selector: 'io-panel',
  templateUrl:"./webApp/component/aside/aside.html"
})


export class AsideComponent {
  
  private _ngZone: NgZone
  private title:String;
  private ipcService:IPCService;
  @Output() configisShow = new EventEmitter<boolean>();
  @Output() configinfos = new EventEmitter<string[]>();
  
  private iscongigshow:boolean=true;
  private SAVE_PATH = "D:/ShopFlow/assemble.ini";
  private startclass:boolean=false;
  private workmodel:workModel;
  private config:{
       Ip:string;
       Station:string;
       StationID:string;
       StationNo:string;
       MAC_ADDR:string;
       line:string;
      
      
    }


  
  constructor( _ngZone: NgZone,ipcService:IPCService,){
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    console.log(_.isString(this.title));
    this.config = {
       Ip: "",
       Station: "",
       StationID: "",
       StationNo: "",
       MAC_ADDR: "",
       line:"",
       
      
    }
    this.ipcService = ipcService;
  }
 ngOnInit() {
   
 }

  saveConfig() {
    this.ipcService.send("machineconfig", this.config);
    this.configinfos.emit([this.config.StationID,this.config.StationNo]);
    console.info(this.config);
    

  }


readmachineconfig(data:any){
  this.config=data;


}

onclose(){
  this.configisShow.emit(this.iscongigshow);
  this.iscongigshow=!this.iscongigshow;


}
}