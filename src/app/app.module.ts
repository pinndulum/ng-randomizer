import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard'; 
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngJsoneditorModule } from '@maaxgr/ang-jsoneditor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogTemplateComponent } from './components/controls/dialog-template/dialog-template.component';
import { TzClockComponent } from './components/controls/tz-clock/tz-clock.component';
import { TzClockListComponent } from './components/controls/tz-clock-list/tz-clock-list.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { BuzzWordsComponent } from './components/pages/buzz-words/buzz-words.component';
import { ChangeLogHistoryComponent } from './components/pages/change-log-history/change-log-history.component';
import { FlipACoinComponent } from './components/pages/flip-a-coin/flip-a-coin.component';
import { HomeComponent } from './components/pages/home/home.component';
import { MockObjectComponent } from './components/pages/mock-object/mock-object.component';
import { PiComponent } from './components/pages/pi/pi.component';
import { PseudoIdentityComponent } from './components/pages/pseudo-identity/pseudo-identity.component';
import { NgVarDirective } from './directives/ng-var.directive';
import { MaterialModule } from './modules/material.module';
import * as pipes from './pipes';

@NgModule({
  declarations: [
    AppComponent,
    DialogTemplateComponent,
    TzClockComponent,
    TzClockListComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    BuzzWordsComponent,
    ChangeLogHistoryComponent,
    FlipACoinComponent,
    HomeComponent,
    MockObjectComponent,
    PiComponent,
    PseudoIdentityComponent,
    NgVarDirective,
    pipes.PrecisionPipe,
    pipes.ReplacePipe,
    pipes.SafePipe,
    pipes.TimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngJsoneditorModule,
    ClipboardModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
