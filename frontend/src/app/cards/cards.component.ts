import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Card } from '../Card';
import { CardService } from '../cardService/card.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  constructor(private cardService: CardService){}
  cartas: Card[] = [];

  ngOnInit()
  {
    this.cartas = this.getAllCards();
  }

  getAllCards(): Card[]
  {
    return this.cardService.getCards();
  }

}
