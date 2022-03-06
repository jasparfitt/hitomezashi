import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import { SquareFormComponent } from './square-form/square-form.component';
import { IsometricFormComponent } from './isometric-form/isometric-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SquareFormComponent,
    IsometricFormComponent,
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
