import { Component, Input } from '@angular/core';

// LIBRARIES
import { NgxChartsModule } from '@swimlane/ngx-charts';

// MODELS
import { ChartData } from '../../models/data.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  @Input() multi!: ChartData[];
  @Input() xAxisLabel!: string;
  @Input() autoScale!: boolean;

  // options
  view: [number, number] = [700, 300];
  colorScheme = 'cool';
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  roundDomains: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  yAxisLabel: string = 'Price [USD]';
  timeline: boolean = false;
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
