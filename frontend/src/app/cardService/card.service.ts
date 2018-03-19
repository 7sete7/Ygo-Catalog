import { Injectable } from '@angular/core';
import { Card } from '../Card';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CardService {

  private baseUrl = `http://localhost:8080/api`;

  constructor(private http: HttpClient) { }

  getCards(): Observable<Object>
  {
    return this.http.get(`${this.baseUrl}/cards/get_all`);
  }
}
