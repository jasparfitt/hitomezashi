import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import ColourInputComponent from './colour-input/colour-input.component';

@NgModule({
  declarations: [
    AppComponent,
    ColourInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export default class AppModule { }
