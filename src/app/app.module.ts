import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {ToasterModule, ToasterService} from 'angular2-toaster';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    ToasterModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [HttpClientModule],
  exports: [ToasterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
