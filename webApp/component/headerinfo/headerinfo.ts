import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { Headerinfo } from '../../common/bean/headerinfo';
import { IPCService } from '../../common/service/ipc.service';
import { LogPanel } from "../logPanel/logPanel";
const dialog = nodeRequire('electron').remote.dialog;






@Component({
  selector: 'headinfo',
  templateUrl:"./webApp/component/headerinfo/headerinfo.html"
})
export class HeaderinfoComponent {
  private _ngZone: NgZone
  private title:String;
  private status:string;
  private ipcService:IPCService;
  private isShow:boolean=false;
  private iscongigshow:boolean=false;
  private configshowtext="配置面板";
  private ioisshowText:string="IO面板";
  private startclass:boolean=false;
  private emergencyclass:boolean=false; 
  private resetclass:boolean=false;
  private suspendclass:boolean=false;
  private isUseShow:boolean=false;
  private pointShow:boolean=false;
  private styleclass:boolean[];
  private chosematerial:string;
  private chosewarehouse:string;
  private opreatelist:number[];
  private fullScreenFlag = false;//全屏
  @Input()
  private headerinfo: Headerinfo;
  @Input()
  private goodnumber:number;
  @Input()
  private CTendtime:number;
  @Input()
  private failnumber:number;
  @Input()
  private configinfomation:{};
  @Input()
  private logs:{time:number,loginfo:string}[];
  @Input()
  private userinformation:{isLogin:boolean,role:string};
  @Output() ioisShow = new EventEmitter<boolean>();
  @Output() configisShow = new EventEmitter<boolean>();
  @Output() isUseShowfun = new EventEmitter<boolean>();
  @Output() ispointPanelShow = new EventEmitter<boolean>();
  @Output() isloginPanelShow = new EventEmitter<boolean>();
  @Output() ischangepwdPanelShow = new EventEmitter<boolean>();
  
  
  
  

  constructor( _ngZone: NgZone,ipcService:IPCService){
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    this.ipcService=ipcService;
    this.styleclass = [false,false,false];
    this.chosematerial="出料";
    this.status="请复位";
    this.chosewarehouse="清除料仓";
    this.opreatelist=[];
  
  }
  startUp(){
    this.startclass=true;
    this.emergencyclass=false;
    this.resetclass=false;
    this.suspendclass=false;
    this.ipcService.send("operate",{
              "code":1
      })
  }
  emergencyStop(){
    this.startclass=false;
    this.resetclass=false;
    this.suspendclass=false;
    this.emergencyclass=true;
    this.ipcService.send("operate",{
              "code":0
      })
  }
  
  reset(){
    this.startclass=false;
    this.suspendclass=false;
    this.emergencyclass=false;
    this.resetclass=true;
    this.ipcService.send("operate",{
              "code":3
      })
    }
  suspend(){
    this.opreatelist.push(0);
    if(this.opreatelist.length%2==0){
      this.startclass=true;
      this.emergencyclass=false;
      this.resetclass=false;
      this.suspendclass=false;
      this.ipcService.send("operate",{
             "code":1
     })
    }else{
       this.startclass=false;
       this.emergencyclass=false;
       this.resetclass=false;
       this.suspendclass=true;
       this.ipcService.send("operate",{
              "code":2
      })
    }
  }
  changestatus(data:number){
      switch(data){
        case 0:
        this.status="未初始化";
        break;
        case 1:
        this.status="未连接";
        break;
        case 2:
        this.status="急停";
        break;
        case 3:
        this.status="请复位";
        break;
        case 4:
        this.status="复位中";
        break;
        case 5:
        this.status="停止中";
        break;
        case 6:
        this.status="就绪";
        break;
        case 7:
        this.status="暂停";
        break;
        case 8:
        this.status="工作中";
        break;
      }

  }
  showIo(){  
    if(this.userinformation.role=="操作员"){
      return;
    }
    this.ioisShow.emit(this.isShow);
   // this.isShow=!this.isShow;
    
  }
  showConfig(){
    if(this.userinformation.role=="操作员"){
      return;
    }
    this.configisShow.emit(this.iscongigshow);
    //this.iscongigshow=!this.iscongigshow;
  }
  openLogPanel(){
     this.isUseShow=true;   
     this.isUseShowfun.emit( this.isUseShow) ;
  }
  loginin(){

   // this.isloginPanelShow.emit(false);
    this.styleclass[0]=false;
    this.styleclass[1]=false;
    if(this.styleclass[2]===true){
      this.styleclass[2]=false;
    }else{
      this.styleclass[2]=true;
    }
  }
  logout(){
    this.isloginPanelShow.emit(false);
  }
  openpointPanel(){
    if(this.userinformation.role=="操作员"){
      return;
    }
    this.ispointPanelShow.emit(this.pointShow)
  }
  outmaterial(){
    if(this.status=="工作中"){
      return;
    }
    this.styleclass[1]=false;
    this.styleclass[2]=false;
    if(this.styleclass[0]===true){
      this.styleclass[0]=false;
    }else{
      this.styleclass[0]=true;
    }
    
   


  }
  showMessageBox(options: object) {
    return new Promise(function (resolve, reject) {
      dialog.showMessageBox(options, (btnIndex: number) => {
        resolve(btnIndex);
      });
    });
  }

  clear(){
    if(this.status=="工作中"){
      return;
    }
    this.styleclass[0]=false;
    this.styleclass[2]=false
    if(this.styleclass[1]===true){
      this.styleclass[1]=false;
    }else{
      this.styleclass[1]=true;
    }
  }
  Achose(){
    this.showMessageBox({
      type: "warning",
      message: "是否确认A仓库出料",
      buttons: ["是", "否"],
      defaultId: 0,
    }).then((btnIndex: number) => {
      if (btnIndex === 0) {
        this.ipcService.send("Warehouseout",{
          "code":"A"
         })
      }
    });
    
    this.chosematerial="A仓库出料";
    this.styleclass[0]=false;

  }
  Bchose(){
    this.showMessageBox({
      type: "warning",
      message: "是否确认B仓库出料",
      buttons: ["是", "否"],
      defaultId: 0,
    }).then((btnIndex: number) => {
      if (btnIndex === 0) {
        //this.clearDepot();
        this.ipcService.send("Warehouseout",{
          "code":"B"
         })
      }
    });
  
    this.chosematerial="B仓库出料";
    this.styleclass[0]=false;
  }
Aclear(){
  this.showMessageBox({
    type: "warning",
    message: "是否确认清除A料仓",
    buttons: ["是", "否"],
    defaultId: 0,
  }).then((btnIndex: number) => {
    if (btnIndex === 0) {
      //this.clearDepot();
      this.ipcService.send("Warehousezero",{
        "code":"A"
       })
    }
  });
  
    this.chosewarehouse="A料仓";
    this.styleclass[1]=false;

  }
  Bclear(){
    this.showMessageBox({
      type: "warning",
      message: "是否确认清除B料仓",
      buttons: ["是", "否"],
      defaultId: 0,
    }).then((btnIndex: number) => {
      if (btnIndex === 0) {
        //this.clearDepot();
        this.ipcService.send("Warehousezero",{
          "code":"B"
         })
      }
    });
    this.chosewarehouse="B料仓";
    this.styleclass[1]=false;
  }
  fullScreen() {//全屏
    this.fullScreenFlag = !this.fullScreenFlag;
    nodeRequire('electron').remote.getCurrentWindow().setFullScreen(this.fullScreenFlag);
    if( this.fullScreen ){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }
  }
  changePwd(){
    this.ischangepwdPanelShow.emit(false);
  }
  
}