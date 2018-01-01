import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'station-b',
  templateUrl:"./webApp/component/stationB/stationB.html"
})


export class StationB{

    private _ngZone: NgZone
    private title: String;
    private isShow:boolean=true;
    
    @Output() ioisShow = new EventEmitter<boolean>();
    private iscongigshow:boolean=true;
    constructor(_ngZone: NgZone) {
        this._ngZone = _ngZone;
        this.title = 'IAStudio';



    }
    ngOnInit() {
    }
    onclose(){
        this.ioisShow.emit(this.isShow);      
      
      }
}