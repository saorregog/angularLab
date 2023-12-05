import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// MODELS
import { RequestType } from '../models/request.model';
import { Autocomplete } from '../models/autocomplete.model';
import { DailyData, MonthlyData } from '../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private http = inject(HttpClient);

  key = '&apikey=CVD6RIZEJX8IILY3';

  constructor() {}

  getData(type: RequestType, symbol: string) {
    if (type === 'autocomplete') {
      return this.http.get<Autocomplete>(
        'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' +
          symbol +
          this.key
      );
    }

    if (type === 'daily') {
      return this.http.get<DailyData>(
        'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' +
          symbol +
          this.key
      );
    }

    if (type === 'monthly') {
      return this.http.get<MonthlyData>(
        'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=' +
          symbol +
          this.key
      );
    }

    return this.http.get(
      'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&' +
        this.key
    );
  }
}
