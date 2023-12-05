import { Injectable } from '@angular/core';

// MODELS
import { Autocomplete } from '../models/autocomplete.model';
import { DailyData, MonthlyData } from '../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  autoCompleteDataInit: Autocomplete = {
    bestMatches: [
      {
        '1. symbol': '',
        '2. name': '',
        '3. type': '',
        '4. region': '',
        '5. marketOpen': '',
        '6. marketClose': '',
        '7. timezone': '',
        '8. currency': '',
        '9. matchScore': '',
      },
    ],
  };

  dailyDataInit: DailyData = {
    'Meta Data': {
      '1. Information': '',
      '2. Symbol': '',
      '3. Last Refreshed': '',
      '4. Output Size': '',
      '5. Time Zone': '',
    },
    'Time Series (Daily)': {
      initialization: {
        '1. open': '',
        '2. high': '',
        '3. low': '',
        '4. close': '',
        '5. volume': '',
      },
    },
  };

  monthlyDataInit: MonthlyData = {
    'Meta Data': {
      '1. Information': '',
      '2. Symbol': '',
      '3. Last Refreshed': '',
      '4. Output Size': '',
      '5. Time Zone': '',
    },
    'Monthly Time Series': {
      initialization: {
        '1. open': '',
        '2. high': '',
        '3. low': '',
        '4. close': '',
        '5. volume': '',
      },
    },
  };

  constructor() {}
}
