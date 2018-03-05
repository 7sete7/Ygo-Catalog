import { Injectable } from '@angular/core';
import { Card } from '../Card';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CardService {

  private baseUrl = "https://www.ygohub.com/api/";

  constructor(private http: HttpClient) { }

  getCards(): Card[]
  {
    let array: Card[] = [];

    this.http.get(this.baseUrl + `all_cards`)
      .map(response => response['cards'])
      .subscribe(data => {
        for (let item of data) {
          array.push(this.getCardInfo(item));
        }
      });
      return array;
  }

  getCardInfo(name): Card
  {
    let carta = new Card();
    this.http.get(this.baseUrl + `card_info?name=${name}`)
      .map(response => response['card'])
      .subscribe(data => {
        for(let key in data){
          carta[key] = data[key];
        }
      });
    return carta;
  }
}
