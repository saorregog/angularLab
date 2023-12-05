import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// SERVICES
import { RequestService } from './services/request.service';
import { InitService } from './services/init.service';

// COMPONENTS
import { TypeheadComponent } from './components/typehead/typehead.component';
import { ChartComponent } from './components/chart/chart.component';
import { TogglesComponent } from './components/toggles/toggles.component';

// MODELS
import { RequestType } from './models/request.model';
import { Autocomplete } from './models/autocomplete.model';
import { ChartData, DailyData, MonthlyData } from './models/data.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    TypeheadComponent,
    ChartComponent,
    TogglesComponent,
  ],
})
export class AppComponent {
  title = 'angularLab';

  private requestService = inject(RequestService);
  private initService = inject(InitService);

  symbol: string = '';

  toggleMode: string = 'daily';

  chartXAxisLabel: string = 'Days';

  autoScale: boolean = true;

  processedAutocompleteData: any = [];

  private processAutocompleteData(data: Autocomplete) {
    this.processedAutocompleteData.length = 0;

    for (let option in data['bestMatches']) {
      this.processedAutocompleteData.push([
        data['bestMatches'][option]['1. symbol'],
        data['bestMatches'][option]['2. name'],
      ]);
    }
  }

  processedDailyData: any = [];

  processedMonthlyData: any = [];

  private processChartData(type: RequestType, data: any) {
    if (type === 'daily') {
      let firstDay: Date | string | null = null;
      let result = [];

      for (let day in data['Time Series (Daily)']) {
        if (!firstDay) {
          firstDay = new Date(day);
          firstDay.setMonth(firstDay.getMonth() - 1);
          firstDay = firstDay.toISOString().substring(0, 10);
        }

        if (day >= firstDay) {
          result.unshift({
            name: day,
            value: data['Time Series (Daily)'][day]['4. close'],
          });
        }
      }

      result = [
        {
          name: data['Meta Data']['2. Symbol'],
          series: result,
        },
      ];

      this.processedDailyData = result;
      this.dataChart = result;
    } else if (type === 'monthly') {
      let firstMonth: Date | string | null = null;
      let result = [];

      for (let month in data['Monthly Time Series']) {
        if (!firstMonth) {
          firstMonth = new Date(month);
          firstMonth.setFullYear(firstMonth.getFullYear() - 1);
          firstMonth = firstMonth.toISOString().substring(0, 7);
        }

        let monthName = month.substring(0, 7);

        if (monthName >= firstMonth) {
          result.unshift({
            name: monthName,
            value: data['Monthly Time Series'][month]['4. close'],
          });
        }
      }

      result = [
        {
          name: data['Meta Data']['2. Symbol'],
          series: result,
        },
      ];
      this.processedMonthlyData = result;
      this.dataChart = result;
    }
  }

  dataChart!: ChartData[];

  onTypeheadListener(event: [RequestType, string]) {
    if (
      event[1] !== this.symbol &&
      (event[0] === 'daily' || event[0] === 'monthly')
    ) {
      this.symbol = event[1];
      this.processedDailyData.length = 0;
      this.processedMonthlyData.length = 0;
    }

    this.requestService.getData(event[0], event[1]).subscribe({
      next: (data: any) => {
        switch (event[0]) {
          case 'autocomplete':
            this.processAutocompleteData(data);
            break;

          case 'daily':
            this.processChartData('daily', data);
            break;

          case 'monthly':
            this.processChartData('monthly', data);
            break;
        }
      },
      error: () => {
        console.log('Error');
      },
    });
  }

  onToggleListener(event: string) {
    if (this.symbol) {
      this.toggleMode = event;

      if (this.toggleMode === 'daily') {
        if (this.processedDailyData.length) {
          this.dataChart = this.processedDailyData;
        } else {
          this.onTypeheadListener(['daily', this.symbol]);
        }
        this.chartXAxisLabel = 'Days';
      } else if (this.toggleMode === 'monthly') {
        if (this.processedMonthlyData.length) {
          this.dataChart = this.processedMonthlyData;
        } else {
          this.onTypeheadListener(['monthly', this.symbol]);
        }
        this.chartXAxisLabel = 'Months';
      }
    }
  }

  onAutoScaleListener() {
    this.autoScale = !this.autoScale;
  }
}
