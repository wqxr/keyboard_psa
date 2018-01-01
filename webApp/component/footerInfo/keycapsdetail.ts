import { Component,NgZone,Input } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { Assembling } from '../../common/bean/assembling';



@Component({
  selector: 'footerinfo',
  templateUrl:"./webApp/component/footerInfo/keycapsdetail.html"
})
export class footerInfoComponent {
  private _ngZone: NgZone
  private title:String;
  @Input()
  private assembling: Assembling;
  @Input()
  private configinfos:{};
  constructor( _ngZone: NgZone){
    this._ngZone = _ngZone;
    this.title = 'IAStudio';
  }
  
}