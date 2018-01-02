import { Component,NgZone,Input,ElementRef,AfterViewInit} from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { productDetail } from '../../common/bean/productdetail';
import { workModel } from '../../common/bean/workmodel';
import { IPCService } from '../../common/service/ipc.service';
import { MSG_TYPE } from "../../common/bean/msgType";
import { Headerinfo } from '../../common/bean/headerinfo';

import * as ECharts from "echarts";





@Component({
  selector: 'leftInfo',
  templateUrl:"./webApp/component/leftInfo/keycaps.html"
})


export class LeftInfoComponent {
  private elementRef: ElementRef;
  private _ngZone: NgZone
  private title:String;
  private ipcService:IPCService;
  private chart: ECharts.ECharts;
  private ctChart:ECharts.ECharts;
  
  @Input()
  private successinfo:string;
  @Input()
  private logs:{time:number,loginfo:string}[];
  
  @Input()
  private protime:number;
  @Input()
  private headerinfo: Headerinfo;
  
  private valueList:number[];
  private dateList:number[];
  private option:any;
      
  
  constructor( _ngZone: NgZone,ipcService:IPCService,elementRef: ElementRef){
      this._ngZone = _ngZone;
      this.title = 'IAStudio';
      this.ipcService = ipcService;
      this.elementRef = elementRef;
      this.valueList = [];
      this.dateList = [];

    this.ipcService.on("TensionInfo",(data)=>{
        
       
      
       
        this._ngZone.run(()=>{
            if(this.protime >1000){
                this.protime=this.protime/1000;
                for(let i=0;i<this.protime;i++){
                    this.dateList.push(i);
                }
            }
          this.valueList.push(data.data.data);
          this.initLanguageChart();
  
  
        })
      })

    this.option={
      
          //Make gradient line here
          visualMap: [{
              show: false,
              type: 'continuous',
              seriesIndex: 0,
              min: 0,
              max: 150
          }, {
              show: false,
              type: 'continuous',
              seriesIndex: 1,
              dimension: 0,
              min: 0,
              max: this.dateList.length - 1
          }],
      
      
          title: [{
              left: 'center',
              text: '压力折线图'
          }, {
             //top: '55%',
              //left: 'center',
              //text: 'Gradient along the x axis'
          }],
          tooltip: {
              trigger: 'axis'
          },
          xAxis: [{
              data: this.dateList
          }, {
              //data: this.dateList,
             // gridIndex: 1
          }],
          yAxis: [{
              splitLine: {show: false}
          }, {
              //splitLine: {show: false},
              //gridIndex: 1
          }],
          grid: [{
              bottom: '10%'
          }, {
              top: '10%'
          }],
          series: [{
              type: 'line',
              showSymbol: false,
              data: this.valueList
          }, {
              type: 'line',
              showSymbol: false,
              data: this.valueList,
             // xAxisIndex: 1,
              yAxisIndex: 1
          }]
      
  
        }
  
  }
  
  ngAfterViewInit() { // 模板中的元素已创建完成

    this.initLanguageChart();
  }   


initLanguageChart() {
 
  let div = this.elementRef.nativeElement.querySelector(".charts");
  this.chart = ECharts.init(div);
 // console.info(this.pressure.length)
  this.chart.setOption(this.option);
}
}
