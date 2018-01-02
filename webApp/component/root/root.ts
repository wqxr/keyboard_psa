import { Component,NgZone,ViewChild,AfterViewInit} from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { IPCService } from '../../common/service/ipc.service';
import { countInfoService } from '../../service/countinfoService';
import { AssemblingService } from '../../service/assemblingService';
import { assemblystatusService } from '../../service/assemblystatusService';
import { TrayinfoService } from '../../service/TrayinfoService';
import { productionRecordService } from '../../service/productionRecordService';

import { Headerinfo } from '../../common/bean/headerinfo';
import { workModel } from '../../common/bean/workmodel';
import { Trayinfo } from '../../common/bean/trayinfo';

import { MSG_TYPE } from '../../common/bean/msgType';
import { productDetail } from '../../common/bean/productdetail';




import { Assembling } from '../../common/bean/Assembling';
//import { AssembleinfoComponent } from "../assembleing/assembleing";
import { footerInfoComponent } from "../footerInfo/keycapsdetail";
import { HeaderinfoComponent } from "../headerinfo/headerinfo";
import { AsideComponent } from "../aside/aside";

import { LeftInfoComponent } from "../leftInfo/keycaps";

import { LogPanel } from "../logPanel/logPanel";
import { LoginlPanel } from "../loginPanel/login.panel";
import { ChangePassword } from "../changePassword/change.password";
const dialog = nodeRequire('electron').remote.dialog;





@Component({
  selector: 'root',
  templateUrl:"./webApp/component/root/root.html"
})
export class AppComponent {
  private _ngZone: NgZone
  private title: String
  private ipcService: IPCService;
  private AstartTime: number;//上料开始时间
  private AendTime: number;//出料结束时间
  private BstartTime: number;//上料开始时间
  private BendTime: number;//出料结束时间
  private countInfoService:countInfoService;
  private assemblystatusService:assemblystatusService;
  private trayinfoService:TrayinfoService;
  private productionRecordService:productionRecordService;
  private headerinfo:Headerinfo;
  private assemblingService:AssemblingService;
  private assembling:Assembling;
  private workmodels:workModel;
  private trayinfo:Trayinfo;
  private productdetail:productDetail;
  private isShow:boolean=true;
  private configShow:boolean=true;
  private isUseShow:boolean=false;
  private logshow:boolean=true;
  private pointshow:boolean=true;
  private goodtotal:number;
  private failtotal:number;
  private logs: { time: number, loginfo: string }[];
  private ctnumber:number[];
  private ctstarttime:number;//ct计数开始时间
  private ctendtime:number;//ct结束时间
  private maskshow:boolean=true;
  private loginStatus: { isLogin: boolean, role: string}
  private SNResult:string;

  // @ViewChild(AssembleinfoComponent) 
  // private assembleing:AssembleinfoComponent;
  @ViewChild(ChangePassword) 
  private changePassword:ChangePassword;
  @ViewChild(LeftInfoComponent) 
  private keycapsComponent:LeftInfoComponent;
  @ViewChild(footerInfoComponent)
  private keycapsDetail:footerInfoComponent;
  @ViewChild(HeaderinfoComponent)
  private headerinfomation:HeaderinfoComponent;
  @ViewChild(LoginlPanel)
  private loginpanel:LoginlPanel;
  @ViewChild(LogPanel)
  private logpanel:LogPanel;
  @ViewChild(AsideComponent)
  private asidecomponent:AsideComponent;
  private configinfo = {
    configname: "",
    configid: "",
  }


  constructor( _ngZone: NgZone,
           ipcService: IPCService,
           countInfoService:countInfoService,
           assemblingService:AssemblingService,
           assemblystatusService:assemblystatusService,
           trayinfoService:TrayinfoService,
           productionRecordService:productionRecordService,


  ){
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
    this.ipcService=ipcService;
    this.countInfoService=countInfoService;
    this.assemblingService=assemblingService;
    this.assemblystatusService=assemblystatusService;
    this.trayinfoService=trayinfoService;
    this.productionRecordService=productionRecordService;
    this.logs = [];
    this.ctnumber=[];
    this.loginStatus = {
      isLogin: false,
      role: "登录",
    };
    this.goodtotal=0;
    this.ctendtime=0;
    this.failtotal=0;
   
   
    
   
    
  }
  ngOnInit(){
    this.headerinfo=new Headerinfo();
    this.workmodels=new workModel();
    this.trayinfo=new Trayinfo();
    this.assembling=new Assembling();
    this.productdetail=new productDetail();
    this.headerinfo.Acycletime=0;
    this.headerinfo.CT=0;
    this.headerinfo.goodnumber=0;
    this.headerinfo.badnumber=0;
    this.headerinfo.goodprobability=0;
    this.headerinfo.totalnumber=0;
     this.ipcService.on("countInfo", (data) => {
      this._ngZone.run(() => {        
        
        console.log("接受到的数据:"+data.data);
        
      });
    });
    this.ipcService.on("workingDetail", (data) => {
      this._ngZone.run(() => {
        this.assemblingService.updateheadInfo(this.assembling,data.data,1);
        this.assemblingService.updateheadInfo(this.assembling,data.data,2); 
        console.log("接受到的数据:"+data.data);  
      });
    });
    this.ipcService.on("assemblyStatus", (data) => {
      this._ngZone.run(() => {      
        console.log("接受到的数据:"+data);   
       //this.assembleing.workassemb(data.data[0]); 

      });
    });
    

    this.ipcService.on("trayInfo", (data) => {
      this._ngZone.run(() => {
        this.trayinfoService.updatetrayInfo(this.trayinfo,data.data);
      })
    })
    this.ipcService.on("emptyTray",(data)=>{
      this._ngZone.run(()=>{
        
      })
    })
    this.ipcService.on("productionRecord",(data)=>{
      this._ngZone.run(()=>{
        this.productionRecordService.updateheadInfo(this.productdetail,data)
      })
    })
    this.ipcService.on("alarm",(data)=>{//报警信息
      this._ngZone.run(()=>{
        this.logs.push({
          time: Date.now(), loginfo: data.data.msg
        });
        
      })
    })
    this.ipcService.on("opsStatus",(data)=>{
      this._ngZone.run(()=>{
        
          this.headerinfomation.changestatus(data.data.status);
      })
    })
    this.ipcService.on("inmaterial",(data)=>{//上料信号
      this._ngZone.run(()=>{
        if(data.data.code==="A"){
          this.AstartTime = Date.now();
        }else{
          this.BstartTime=Date.now();
        }
      })
    })

    this.ipcService.on("page_readyResult",(data)=>{//页面一加载
      this._ngZone.run(()=>{  
         //this.keycapsComponent.readconfig(data.data);   
        // this.asidecomponent.readmachineconfig(data.data);
        console.info(data.data);
        this.assemblingService.onloadProduct(this.assembling,data.data) ;
      })
    })
    this.ipcService.on("machineconfig",(data)=>{//页面一加载发送设备信息
      this._ngZone.run(()=>{  
         this.asidecomponent.readmachineconfig(data.data);
         this.configinfo.configid=data.data.strStationID;
         this.configinfo.configname=data.data.strStationNo;

      })
    })
    // this.ipcService.on("traytotal",(data)=>{//Tray盘计数
    //   this._ngZone.run(()=>{
    //     if(data.data.code==="A"){
    //       this.headerinfo.Atraynumber = data.data.traytotal;
    //     }else{
    //       this.headerinfo.Btraynumber=data.data.traytotal;
    //     }       
    //   })
    // })
    this.ipcService.on("onloadProduct",(data)=>{//Tray盘计数
      this._ngZone.run(()=>{
        console.info("wqwqwqwq",data.data)
        this.assemblingService.onloadProduct(this.assembling,data.data) ;  
        
      })
    })
    this.ipcService.on("outmaterial", (data) => {//出料
      this._ngZone.run(() => { 
        this.headerinfo.totalnumber++;
        if(data.data.code==1){
          this.ctstarttime = Date.now(); 
          this.ctnumber.push(this.ctstarttime);
          if (this.ctnumber.length >= 2) {
              this.headerinfo.CT =(this.ctnumber[this.ctnumber.length-1] - this.ctnumber[this.ctnumber.length-2])/1000;//CT计数         
          }      
            this.AendTime = Date.now();
            this.headerinfo.Acycletime = (this.AendTime - this.AstartTime) / 1000;//贴合时间
            this.headerinfo.goodnumber++;
            this.assemblingService.productdetailinfo(this.assembling,data.data)
        } else{
            this.headerinfo.badnumber++;
        } 
    
      })
    })

    this.ipcService.on("scanResult", (data) => {//获取SN，即上料信息
      this._ngZone.run(() => {
        if(data.data.SNresult!==""&& data.data.SNresult!=undefined){
          this.headerinfo.SN=data.data.SNresult;
          this.AstartTime = Date.now();
        }else{
          this.showMessageBox({
            type: "warning",
            message: "获取SN失败"
          });
          return;
        }
          
      });
    });
  
    this.ipcService.on(MSG_TYPE.SEND_TO_MSG,(response)=>{
      this._ngZone.run(()=>{
        console.info(response.data);
        if (undefined !== response.data.log) { //中间件发送来的日志
          //this.currenttime=Date.now();      
          this.logs.push({
            time: Date.now(), loginfo: response.data.log
          });
          setTimeout(() => {
            document.getElementById('').scrollTop = document.getElementById('js_logDiv').scrollHeight;
          }, 0);
        }
        if (undefined !== response.data.error) {//中间件发送来的异常信息
          this.logs.push({
            time: Date.now(), loginfo: response.data.error
          });
          setTimeout(() => {
            document.getElementById('js_logDiv').scrollTop = document.getElementById('js_logDiv').scrollHeight;
          }, 0);
        }
      })
    })
    
   
  }
  ngAfterViewInit() {
    this.ipcService.send("pageready", {});
    this.maskshow=false;
  }
  showIo(isioshow:boolean){
    this.isShow=isioshow;
    console.info(this.isShow);
    
  }
  showMessageBox(options: object) {
    return new Promise(function (resolve, reject) {
      dialog.showMessageBox(options, (btnIndex: number) => {
        resolve(btnIndex);
      });
    });
  }
  showconfig(configshow:boolean){
    this.configShow=configshow;
    }
  changepwd(pwdpanel:boolean){
    this.changePassword.show();
    }
 
  showfunlog(showlogfunction:boolean){
   
      this.isUseShow=showlogfunction;
      if(this.isUseShow==true){
        
        this.logpanel.show()
        .then((result:boolean)=>{
          this.logshow=result;
        });
        
      }
      

    
    }
    showlogpanel(logpanelshow:boolean){
      this.logshow=logpanelshow;
    }
    showpointpanel(Pointshow:boolean){
      this.pointshow=Pointshow;
    }
    showconfiginfo(stationname: string[]){
      this.configinfo.configname = stationname[1];
      this.configinfo.configid = stationname[0];

    }
    loginshow(logineeshow:boolean){
    //this.loginpanel.hiddenLoginPanel()
    this.loginpanel.showLoginPanel();
      this.maskshow=false;
    }
    getgoodnumber(goodnumber:number[]){
      this.goodtotal=goodnumber[0];
      this.ctendtime=goodnumber[1]


    }
    getfailnumber(failnumber:number){
      this.failtotal=failnumber;

    }
    getuserinfo(result: { isLogin: boolean, role: string }){
      //this.loginStatus.role=result.role;
      if(result.role=="admin"){
        this.loginStatus.role="管理员";
      }else{
        this.loginStatus.role="操作员";
      }
      this.loginStatus.isLogin=result.isLogin;
      
      this.maskshow=true;
    }
}