const path = require("path");
const fs = require('fs');

const fsEx = require('fs-extra');
const XLSX = require('xlsx');
const iconv = require('iconv-lite');

let LOGS_DIR = "";
const excelTyep = "csv";

const errorLogFileName = "错误日志";
const productdetailName="生产记录";





let excelLogUtil = {
  init: init,
  addErrorLogRecord:addErrorLogRecord,
  addProductDetail:addProductDetail,
};

/**
 * 
 * @param {MongodbService} mongodbService 
 */
function init() {
  console.log("LOGS_DIR",LOGS_DIR);
  let today = new Date();
  LOGS_DIR = path.join(__dirname, "..", "..", "logs","日志记录");
  LOGS_DIR = path.join(LOGS_DIR,today.getFullYear()+"年",today.getMonth() + 1 + "月",today.getDate()+"日");
  console.log("LOGS_DIR",LOGS_DIR);
  return fsEx.ensureDir(LOGS_DIR);
}



/**
 * 增加一条异常信息
 */
function addErrorLogRecord(errorCode,message,SN){
  SN = SN||"";
  return new Promise((resolve,reject)=>{
    ensureFileForErrorLog().
    then( ()=>{
      let filePath = path.join(LOGS_DIR, errorLogFileName + "." + excelTyep);
      let now = new Date();
      let newRow = [];
      newRow[0] = now.getFullYear() + "/"+ (now.getMonth()+1) + "/" + now.getDate();
      newRow[1] = now.getHours() + ":" + now.getMinutes() + ":"+now.getSeconds();
      newRow[2] = errorCode;
      newRow[3] = message;
      newRow[4] = SN;
      newRow = newRow.join(",");
      newRow = "\r\n" + newRow;
      newRow = iconv.encode(newRow, "GBK");
      fs.appendFile(filePath, newRow, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    })
    .catch((error)=>{
      reject(error);
    });
    
  });
}
function addProductDetail(errorCode,message){
 // SN = SN||"";
  return new Promise((resolve,reject)=>{
    ensureFileForErrorLog().
    then( ()=>{
      let filePath = path.join(LOGS_DIR, productdetailName + "." + excelTyep);
      let now = new Date();
      let newRow = [];
      newRow[0] = now.getFullYear() + "/"+ (now.getMonth()+1) + "/" + now.getDate();
      newRow[1] = now.getHours() + ":" + now.getMinutes() + ":"+now.getSeconds();
      newRow[2] = errorCode;
      newRow[3] = message.PCBSN;
      newRow[4] = message.TraySN;
      newRow[5] = message.type;
      newRow[6] = message.jobnumber;
      newRow = newRow.join(",");
      newRow = "\r\n" + newRow;
      newRow = iconv.encode(newRow, "GBK");
      fs.appendFile(filePath, newRow, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    })
    .catch((error)=>{
      reject(error);
    });
    
  });
}




/**检查按键搜索记录文件是否存在，不存在则初始化该文件 */
function ensureFileForSearchKey() {
  return new Promise(function (resolve, reject) {
    let filePath = path.join(LOGS_DIR, searchKeyFileName + "." + excelTyep);
    fsEx.pathExists(filePath)
      .then((isExists) => {
        if (false === isExists) {
          return initSearchKeyFile(filePath);
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}




function ensureFileForErrorLog(){
  return new Promise(function (resolve, reject) {
    let filePath = path.join(LOGS_DIR, errorLogFileName + "." + excelTyep);
    fsEx.pathExists(filePath)
      .then((isExists) => {
        if (false === isExists) {
          return initErrorLogFile(filePath);
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 初始化错误日志文件
 * @param {string} filePath 
 */
function initErrorLogFile(filePath){
  let header = "Date,Time,ErrorCode,ErrorDescription,SN";
  header = iconv.encode(header, "GBK");
  return fsEx.writeFile(filePath, header);
}

function getTimeStr() {
  let today = new Date();
  let dateStr = today.getFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日";
  dateStr += today.getHours() + "时" + today.getMinutes() + "分" + today.getSeconds() + "秒";
  return dateStr;
}




module.exports = excelLogUtil;