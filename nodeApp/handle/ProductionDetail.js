const BaseHandler = require("./baseHandler.js");
const MongodbService = require("../service/mongodbService.js");
const WebSocketUtil = require("../service/WebSocketUtil.js");
const collectionName = require("../common/collectionName.js");
const MSG_TYPE = require('../common/systemVar.js').msgType;
const fsEx = require('fs-extra');
let  startTime=0;
let endTime=0;
let traynumber=[];


class ProductionDetailHandler extends BaseHandler {
    /**
     * 执行数据处理前的准备工作
     */
    befor() {
        startTime = Date.now();
        console.log("start handle SaveConfigHandler");
    }
    /**
     * 处理完成后的一些处理
     */
    after() {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("finish handle SaveConfigHandler,cost time " + cost + "s");
    }
    sendOK() {
      this.webSocketUtil.sendToPage(MSG_TYPE.SAVE_CONFIG_RESULT,{
        resultCode:0,msg:"",
      });
    }
    onError(error) {
        endTime = Date.now();
        let cost = (endTime - startTime) / 1000;
        console.log("error on handle SaveConfigHandler,cost time " + cost + "s");
    }
    /**
     * 处理数据
     */
    async handle(data) {
        console.info(data);
        let currenttime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();        
        let sendpage={"precision":"","checkinfo":"","SN":data.SN,"time":currenttime,"code":data.code};
        let precisionCollection = await this.mongodbService.getCollection( collectionName.precision);
        let checkCollection=await this.mongodbService.getCollection(collectionName.checkinfodetail);
        let productdetail=await this.mongodbService.getCollection(collectionName.productdetail);
        let detail=await precisionCollection.find({SN:data.SN}).toArray();
        let checkinfo=await checkCollection.find({SN:data.SN}).toArray();
        let product=await productdetail.findOne({SN:data.SN});
        console.info(product);
        if(data.code===1&&detail&&checkinfo){
            sendpage.precision=detail[0].precisionXinfo+","+detail[0].precisionYinfo+","+detail[0].precisionAngleinfo;
            sendpage.checkinfo=checkinfo[0].checkinfoXinfo+","+checkinfo[0].checkinfoYinfo+","+checkinfo[0].checkinfoAngleinfo;
            if(product){               
            }else{
               let productDetail=await productdetail.insertOne(sendpage);               
            }           
                this.webSocketUtil.sendToPage("outmaterial", sendpage);   
        }  
    }
}
module.exports = ProductionDetailHandler;