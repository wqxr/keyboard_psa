import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'point-panel',
  templateUrl:"./webApp/component/pointPanel/pointPanel.html"
})


export class PointPanel{

    private _ngZone: NgZone
    private title: String;
    private pointshow:boolean=true;
    private stationAshow:boolean=false;
    private stationBshow:boolean=true;
    private showFlag:boolean[];
    
    @Output() ispointPanelShow = new EventEmitter<boolean>();
    private iscongigshow:boolean=true;
    constructor(_ngZone: NgZone) {
        this._ngZone = _ngZone;
        this.title = 'IAStudio';
        this.showFlag = [true,false];
        



    }
    ngOnInit() {
    }
    onclose(){
        this.ispointPanelShow.emit(this.pointshow);
    
      }
      openStationA(){
          this.stationAshow=false;
          this.stationBshow=true;
          this.showFlag=[true,false];

      }
      openstationB(){
          this.stationBshow=false;
          this.stationAshow=true;
          this.showFlag=[false,true];
      }
}