import { Component, NgZone, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";

@Component({
  selector: 'change-password',
  templateUrl: "./webApp/component/changePassword/changePassword.html",
})
export class ChangePassword implements OnInit {
  private display: string;
  private oldPsw: string;
  private password: string;
  private passwordAgain: string;
  private resolveFunc: Function;
  private rejectFunc: Function;
  private ipcService: IPCService;
  private errorMsg:string;
  @Input()
  private userinformation: { isLogin: boolean, role: string};
  // @Output()
  // private loginResult = new EventEmitter<{ isLogin: boolean, role: string }>();
  constructor(ipcService: IPCService) {
    this.display = "none";
    this.oldPsw = "";
    this.passwordAgain = "";
    this.password = "";
    this.ipcService = ipcService;
    this.errorMsg = "";
  }
  ngOnInit() {
    // this.ipcService.on(MSG_TYPE.SEND_CMD_RESULT, (response) => {
    //   if (response.data.cmd !== CMD.LOGIN) {
    //     return;
    //   }
    //   if (response.data.resultCode === 1) {
    //     this.loginResult.emit({
    //       isLogin: true, role: "admin"
    //     });
    //     this.hidden();
    //     this.resolveFunc();
    //   }
    // });
  }
  reset(){
    console.log(this.oldPsw,this.password,this.passwordAgain);
    if( false === this.check() ){
      return;
    }
    this.ipcService.send("changepwd",{"oldPsw":this.oldPsw,"newPsw":this.password});
    this.hidden();
  }
  show() {
    this.display = "flex";
    return new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
      this.rejectFunc = reject;
    });
  }
  hidden() {
    this.display = "none";
  }
  check(){
    this.errorMsg = "";
    if(!this.oldPsw){
      this.errorMsg = "请输入旧密码";
      return false;
    }
    if(!this.password){
      this.errorMsg = "请输入新密码";
      return false;
    }
    if(!this.passwordAgain){
      this.errorMsg = "请再次输入新密码";
      return false;
    }
    if( this.password !== this.passwordAgain ){
      this.errorMsg = "两次输入的密码不一致";
      return false;
    }
    return true;
  }
}