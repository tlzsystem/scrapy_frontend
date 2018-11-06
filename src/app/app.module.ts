import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { WebapiService } from './services/webapi.service';
import { ExcelService } from './services/excel.service';

import { HttpClientModule } from '@angular/common/http'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor  } from './services/request-interceptor';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    HttpClientModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    WebapiService, 
    ExcelService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
