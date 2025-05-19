import {Component, OnInit} from '@angular/core';
import {Chart, ChartConfiguration} from "chart.js";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  public barChartLegend = true;
  public barChartPlugins = [];


  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Akuressa', 'Malimbada', 'Welipitiya' ],
    datasets: [
      { data: [ 65, 59, 90], label: 'Teacher',borderColor: '#36A2EB', backgroundColor: '#9BD0F5' },
      { data: [ 28, 48, 40 ], label: 'Principal',borderColor: '#FF6384', backgroundColor: '#FFB1C1' },
      { data: [ 44, 48, 40], label: 'School',borderColor: '#110105', backgroundColor: '#858081'},
    ],
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };


  constructor() {
  }

}
