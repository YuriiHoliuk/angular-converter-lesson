import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ServerRate } from 'src/typedefs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyRateService {
  constructor(
    private http: HttpClient,
  ) { }

  getRate(currency: string): Observable<ServerRate> {
    return this.http.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
      .pipe(
        map((data): ServerRate => {
          const neededRate = (data as ServerRate[]).find((rate) => rate.ccy === currency);

          if (neededRate) {
            return neededRate;
          }

          return {
            ccy: currency,
            buy: 1,
            sale: 1,
          } as ServerRate;
        }),
      );
  }
}
