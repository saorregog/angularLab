import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// SERVICES
import { RequestService } from './services/request.service';

// COMPONENTS
import { TypeheadComponent } from './components/typehead/typehead.component';
import { ChartComponent } from './components/chart/chart.component';
import { TogglesComponent } from './components/toggles/toggles.component';

// MODELS
import { RequestType } from './models/request.model';
import { Autocomplete } from './models/autocomplete.model';

// LIBRARIES
import { ToastrService } from 'ngx-toastr';

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
  private toastrService = inject(ToastrService);

  symbol: string = '';

  toggleMode: string = 'daily';

  autoScale: boolean = true;

  processedAutocompleteData: any = [];

  processedDailyData: any = [];

  processedMonthlyData: any = [];

  dataChart!: any;

  ngOnInit() {
    if (sessionStorage.length) {
      this.symbol = sessionStorage.getItem('symbol') ?? this.symbol;
      this.toggleMode = sessionStorage.getItem('toggleMode') ?? this.toggleMode;
      this.autoScale =
        JSON.parse(sessionStorage.getItem('autoScale') ?? 'ERROR') ??
        this.autoScale;

      if (
        sessionStorage.getItem('processedDailyData') &&
        this.toggleMode === 'daily'
      ) {
        this.dataChart = JSON.parse(
          sessionStorage.getItem('processedDailyData') ?? 'ERROR'
        );
        this.processedDailyData = JSON.parse(
          sessionStorage.getItem('processedDailyData') ?? 'ERROR'
        );
      }

      if (
        sessionStorage.getItem('processedMonthlyData') &&
        this.toggleMode === 'monthly'
      ) {
        this.dataChart = JSON.parse(
          sessionStorage.getItem('processedMonthlyData') ?? 'ERROR'
        );
        this.processedMonthlyData = JSON.parse(
          sessionStorage.getItem('processedMonthlyData') ?? 'ERROR'
        );
      }
    }
  }

  private processAutocompleteData(data: Autocomplete) {
    this.processedAutocompleteData.length = 0;

    for (let option in data['bestMatches']) {
      this.processedAutocompleteData.push([
        data['bestMatches'][option]['1. symbol'],
        data['bestMatches'][option]['2. name'],
      ]);
    }
  }

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

  private saveOnSessionStorage() {
    sessionStorage.setItem('symbol', this.symbol);
    sessionStorage.setItem('toggleMode', this.toggleMode);
    sessionStorage.setItem('autoScale', String(this.autoScale));
    sessionStorage.setItem(
      'processedDailyData',
      JSON.stringify(this.processedDailyData)
    );
    sessionStorage.setItem(
      'processedMonthlyData',
      JSON.stringify(this.processedMonthlyData)
    );
  }

  onTypeheadListener(event: [RequestType, string]) {
    if (
      event[1] !== this.symbol &&
      (event[0] === 'daily' || event[0] === 'monthly')
    ) {
      this.processedDailyData.length = 0;
      this.processedMonthlyData.length = 0;
      sessionStorage.clear();
    }

    this.requestService.getData(event[0], event[1]).subscribe({
      next: (data: any) => {
        switch (event[0]) {
          case 'autocomplete':
            this.processAutocompleteData(data);
            break;

          case 'daily':
            if (data.hasOwnProperty('Meta Data')) {
              this.symbol = event[1];
              this.processChartData('daily', data);
            } else if (data.hasOwnProperty('Error Message')) {
              this.toastrService.error(
                "This stock symbol doesn't exists!",
                'ERROR',
                {
                  closeButton: true,
                  timeOut: 3000,
                  progressBar: true,
                }
              );
            } else if (data.hasOwnProperty('Information')) {
              this.toastrService.warning(
                'You have reached the free 25 API requests!',
                'API Error',
                {
                  closeButton: true,
                  timeOut: 3000,
                  progressBar: true,
                }
              );
            }
            this.saveOnSessionStorage();
            break;

          case 'monthly':
            if (data.hasOwnProperty('Meta Data')) {
              this.symbol = event[1];
              this.processChartData('monthly', data);
            } else if (data.hasOwnProperty('Error Message')) {
              this.toastrService.error(
                "This stock symbol doesn't exists!",
                'ERROR',
                {
                  closeButton: true,
                  timeOut: 3000,
                  progressBar: true,
                }
              );
            } else if (data.hasOwnProperty('Information')) {
              this.toastrService.warning(
                'You have reached the free 25 API requests!',
                'API Error',
                {
                  closeButton: true,
                  timeOut: 3000,
                  progressBar: true,
                }
              );
            }
            this.saveOnSessionStorage();
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
      sessionStorage.setItem('toggleMode', this.toggleMode);

      if (this.toggleMode === 'daily') {
        if (this.processedDailyData.length) {
          this.dataChart = this.processedDailyData;
        } else {
          this.onTypeheadListener(['daily', this.symbol]);
        }
      } else if (this.toggleMode === 'monthly') {
        if (this.processedMonthlyData.length) {
          this.dataChart = this.processedMonthlyData;
        } else {
          this.onTypeheadListener(['monthly', this.symbol]);
        }
      }
    }
  }

  onAutoScaleListener() {
    this.autoScale = !this.autoScale;
    sessionStorage.setItem('autoScale', String(this.autoScale));
  }
}
