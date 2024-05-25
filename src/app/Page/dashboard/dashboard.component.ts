import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { ChartOptions, ChartType, ChartDataset  } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any;
  selectedYear: number = new Date().getFullYear();
  loading: boolean = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDataDashboard();
  }

  loadDataDashboard() {
    this.loading = true; // Définir le chargement en cours
    setTimeout(() => {
      this.dashboardService.getDashboardData(this.selectedYear)
        .subscribe(
          data => {
            console.log(data.dataChart)
            this.dashboardData = data;
            this.barChartData[0].data = data.dataChart;
            this.loading = false; // Fin du chargement
          },
          error => {
            console.error('Error fetching dashboard data:', error);
            this.loading = false; // Fin du chargement en cas d'erreur
          }
        );
    }, 500);
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Series A' }
  ];
}
