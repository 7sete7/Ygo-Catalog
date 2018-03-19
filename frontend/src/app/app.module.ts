import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { CardsComponent } from './cards/cards.component';
import { CardService } from './cardService/card.service';

const appRoutes: Routes = [
  {path: 'cards', component: CardsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    CardsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [
    CardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
