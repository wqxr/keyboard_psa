import { Component,NgZone,Input,Output,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'station-a',
  templateUrl:"./webApp/component/stationA/stationA.html"
})


export class StationA{

    private _ngZone: NgZone
    private title: String;
    private isShow:boolean=true;
    
    @Output() ioisShow = new EventEmitter<boolean>();
    private iscongigshow:boolean=true;
    constructor(_ngZone: NgZone) {
        this._ngZone = _ngZone;
        this.title = 'IAStudio';
        console.log(_.isString(this.title));



    }
    ngOnInit() {
    }
    onclose(){
        this.ioisShow.emit(this.isShow);      
      
      }
}