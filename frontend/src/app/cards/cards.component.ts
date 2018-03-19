import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Card } from '../Card';
import { CardService } from '../cardService/card.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  constructor(private cardService: CardService,
              private _sanitizer: DomSanitizer){}

  cartas: any[] = [];
  keys: any[] = [];
  toShow: String[] = [
    'attack',
    'damage',
    'price_avg',
    'stars'
  ];

  ngOnInit()
  {
    this.getAllCards();
  }

  getAllCards(): void
  {
    this.cardService.getCards()
     .subscribe(res => {
       this.cartas = res;
       this.keys = Object.keys(res[0]);
     });
  }

  getBackground(url){
    return this._sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

}
