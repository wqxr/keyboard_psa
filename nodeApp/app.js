const WebSocketUtil = require("./service/WebSocketUtil");
const excellogUtil = require("./service/excellogUtil");

const msgType = require("./common/systemVar.js").msgType;
const SYSTEM_VAR = require("./common/systemVar.js");

const { ipcMain } = require('electron');
const wsURL = require("./common/systemVar.js").wsURL;
const mongodbURL = require("./common/systemVar.js").mongodbURL;

const logger = require("./service/logger");
const uiHandler = require("./handle/uiHandler");
const MongodbService = require("./service/mongodbService");
const ProductionDetailHandler=require("./handle/ProductionDetail.js")
const ConfigHandler=require("./handle/configHandler.js")
const ReadConfigHandler=require("./handle/readConfig.js")
const PcbtotalHandler=require("./handle/pcbTotal.js")
const MachineconfigHandler=require("./handle/readmachineconfig.js")
const GetmachineConfigHandler=require("./handle/getmachineconfig.js")
const ReadproductDetail=require("./handle/readProductdetail.js")

//const ProductionDetail=require("./handle/ProductionDetail.js")






let handler={
  productionDetailHandler:new ProductionDetailHandler(),
  configHandler:new ConfigHandler(),
  readconfig:new ReadConfigHandler(),
  pcbTotalHandler:new PcbtotalHandler(),
  machineconfigHandler:new MachineconfigHandler(),
  getmachineconfigHandler:new GetmachineConfigHandler(),
  readproductdetail:new ReadproductDetail(),
 

  
};


class GascoigneApp {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    ipcMain.on(msgType.SEND_TO_MID,(event,arg)=>{
      try{
        switch(arg.msgType){
          case "operate":
              this.socket.send(arg.msgType, arg.data); 
              break;
          case "workModel":
              this.socket.send(arg.msgType,arg.data);
              handler.configHandler.init(this.mongodbService,this.socket);
              handler.configHandler.run(arg.data);
              break;
          case "Warehouseout":
              this.socket.send(arg.msgType,arg.data);
              break;
          case "Warehousezero":
              this.socket.send(arg.msgType,arg.data);
              break;
          case "pageready":
                handler.readconfig.init(this.mongodbService,this.socket);
                handler.readconfig.run();
                handler.getmachineconfigHandler.init(this.mongodbService,this.socket);
                handler.getmachineconfigHandler.run();
                handler.readproductdetail.init(this.mongodbService,this.socket);
                handler.readproductdetail.run();
                break;
          case "machineconfig":
                handler.machineconfigHandler.init(this.mongodbService,this.socket);
                handler.machineconfigHandler.run(arg.data);
                break;
          case "checkcorrect":
               this.socket.send(arg.msgType,arg.data);  
                break;
          case "UserLogin":
                console.info(arg.data)
                this.socket.send(arg.msgType,arg.data);
                break;
          case "changepwd":
                this.socket.send(arg.msgType,arg.data);
                break;
          case "setParagram":
                console.info(arg.data)
                this.socket.send(arg.msgType,arg.data);
                break;
        }

      }catch(error){
        console.log(error);
      }
    })
  }

async init() {
      logger.debug("init websocket");
      var self = this;
      this.socket = new WebSocketUtil(wsURL,this.mainWindow,handler);
      this.mongodbService=new MongodbService(mongodbURL);
      this.callExe(SYSTEM_VAR.midExePath,SYSTEM_VAR.midExeDir);     
      await this.mongodbService.init();
      await  this.socket.init();
      handler.productionDetailHandler.init(this.mongodbService,this.socket);
      handler.pcbTotalHandler.init(this.mongodbService,this.socket);
      this.socket.addEventListener(()=>{
          self.socket.send('ssssss',  'hello, ray', false);
      });
      
      //this.mainWindow.on('closed', this.mainWindowClosed);
      uiHandler.setMainWin(this.mainWindow);
      // ipcMain.on(msgType.SEND_TO_MID, (event, arg) => {
      //   this.socket.send(arg.msgType, arg.data, arg.isNeedResponse, arg.timeout);
      // });
      excellogUtil.init();     
  }

  mainWindowClosed() {
    this.mainWindow = null;
  }
callExe(path,dir) {
    const { execFile } = require('child_process');
    let options = {
      cwd:dir,
    };
    if( SYSTEM_VAR.isDebug ){
      return Promise.resolve();
    }else{
      return new Promise(function (resolve, reject) {
        const child = execFile(path, [],options, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          }
        });
        setTimeout(function() {
          resolve();
        }, 1000);
      });
    }
  }
}

//let app0 = new GascoigneApp(ipcMain);
//app0.init();
module.exports = GascoigneApp;
