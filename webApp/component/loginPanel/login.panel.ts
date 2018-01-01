import { Component, NgZone, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";



@Component({
  selector: 'login-panel',
  templateUrl: "./webApp/component/loginPanel/loginPanel.html",
})
export class LoginlPanel implements OnInit {
  private display: string;
  private username: string;
  private password: string;
  private role:string;
  private errorMsg: string;
  private resolveFunc: Function;
  private rejectFunc: Function;
  private ipcService: IPCService;

  @Input()
  private loginStatus: { isLogin: boolean, role: string };
  @Input()
  private onlogin:number;
  @Output()
  private loginResult = new EventEmitter<{ isLogin: boolean, role: string }>();
  constructor(ipcService: IPCService) {
    this.display= "block";
    this.username = "";
    this.password = "";
    this.ipcService = ipcService;
   
    this.role = "op";
  }
  ngOnInit() {
   this.ipcService.on("loginresult", (response) => {
     console.info("用户："+response.data.resultCode);
      if (response.data.resultcode !==1) {
        this.errorMsg="您输入的密码错误";
        return;
      }
      if (response.data.resultCode === 1) {
        this.loginResult.emit({
          isLogin: true, role: this.role,
        });
        this.hiddenLoginPanel();
       
        
      }
    });
  }
  userlogin() {
    if( false === this.check() ){
      return;
    }
    if( this.role === "admin"){
      this.username = "admin";
    }else{
      this.username = "op";
    }
    this.ipcService.send("UserLogin",{"username":this.role,"psw":this.password});
    this.display="none";
    this.loginResult.emit({
      isLogin: true, role: this.role,
    });
    
  }
  loginin(event:any){
    if(event.keyCode===13){
      this.userlogin();
    }
    

  }
  // showLoginPanel() {
  //   this.display = "flex";
  //   this.password="";
  //   return new Promise((resolve, reject) => {
  //     this.resolveFunc = resolve;
  //     this.rejectFunc = reject;
  //   });
  // }
  hiddenLoginPanel() {   
      this.display="none";
  }
  showLoginPanel(){
    this.display="block";
  }
  check(){
    this.errorMsg = "";
    if(!this.password){
      this.errorMsg = "请输入密码";
      return false;
    }
    return true;
  }
}