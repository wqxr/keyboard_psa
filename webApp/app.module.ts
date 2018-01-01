import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './component/root/root';
import { HeaderinfoComponent } from './component/headerinfo/headerinfo';
import { FormsModule } from '@angular/forms';

//import { AssembleinfoComponent } from './component/assembleing/assembleing';
import { LeftInfoComponent } from './component/leftInfo/keycaps';
import { AsideComponent } from './component/aside/aside';
//import { Configpanel } from './component/configPanel/configpanel';
import { LogPanel } from './component/logPanel/logPanel';
import { PointPanel } from './component/pointPanel/pointPanel';
import { LoginlPanel } from './component/loginPanel/login.panel';
import { ChangePassword } from './component/changePassword/change.password';

import { StationB } from './component/stationB/stationB';
import { StationA } from './component/stationA/stationA';





import { footerInfoComponent } from './component/footerInfo/keycapsdetail';
import { IPCService } from './common/service/ipc.service';
import { countInfoService } from './service/countinfoService';
import { AssemblingService } from './service/assemblingService';
import { assemblystatusService } from './service/assemblystatusService';
import { TrayinfoService} from './service/TrayinfoService';
import { productionRecordService} from './service/productionRecordService';





@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    HeaderinfoComponent,
    LeftInfoComponent,
    footerInfoComponent,
    //KeycapDetailComponent,
    AsideComponent,
    //Configpanel,
    LogPanel,
    PointPanel,
    StationB,
    StationA,
    LoginlPanel,
    ChangePassword
    

  ],
  providers: [
    IPCService,
    countInfoService,
    AssemblingService,
    assemblystatusService,
    TrayinfoService,
    productionRecordService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }