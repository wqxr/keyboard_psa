import { Component, NgZone, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";


const dialog = nodeRequire('electron').remote.dialog;
const path = nodeRequire('path');
const fs = nodeRequire('fs');
const iconv = nodeRequire('iconv-lite');

@Component({
  selector: 'log-panel',
  templateUrl: "./webApp/component/logPanel/logPanel.html",
})
export class LogPanel implements OnInit {
  private display: string;
  /**最近一次选择的目录 */
  private lastDir:string;
  private content:string;
  private _ngZone: NgZone
  
  private rowArray:string[][];
  private islogUseShow:boolean=true;
  @Output() logpanelisShow = new EventEmitter<boolean>();
  
  constructor(_ngZone: NgZone) {
    this.display = "none";
    this.lastDir = null;
    this.rowArray = [];
    this._ngZone = _ngZone;
    
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
    //     this.hiddenLoginPanel();
    //     this.resolveFunc();
    //   }
    // });
  }
  show() {
    return new Promise((resolve, reject)=> {
      this.rowArray = [];
     
      let dir = "";
      if (this.lastDir !== null) {
        dir = this.lastDir;
      } else {
        dir = path.join(__dirname, "..", "..", "..", "logs", "日志记录");
      }
      let options = {
        title: "选择日志文件",
        defaultPath: dir,
        properties: ["openFile"],
      };
      dialog.showOpenDialog(options, (filePaths: string[]) => {
        if (!filePaths) {
          reject();
          return;
        } else {
          fs.readFile(filePaths[0], (err: any, data: string) => {
            if (err) {
              reject(err);
              return;
            }
            this._ngZone.run(() => {
              data = iconv.decode(data, "GBK");
              this.content = data;
              let rowList = this.content.split("\r\n");
              rowList.forEach((rowItem: string) => {
                this.rowArray.push(rowItem.split(","));
              });
              this.lastDir = path.join(filePaths[0], "..");
            })
            resolve(!this.islogUseShow);
          })
        }
      })
    })    
  }
  onclose(){
    this.logpanelisShow.emit(this.islogUseShow)

  }
  hidden() {
    this.display = "none";
  }
}