import { Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ReportService} from "../../report/reportservice";
import {CountByDesignation} from "../../report/entity/countbydesignation";
import {Countbyallqueries} from "../../report/entity/countbyallqueries";

import {Router} from "@angular/router";
import {Gradetype} from "../../entity/gradetype";
import {Noticeservice} from "../../service/noticeservice";
import {Notice} from "../../entity/notice";
import {User} from "../../entity/user";
import {Userservice} from "../../service/userservice";
import {Arrearsbydivision} from "../../report/entity/arrearsbydivision";


declare var google: any;


interface PieChartConfig {
  data: any[];
  options: any;
  chartElement: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})


export class DashboardComponent implements OnInit{

  notices: Array<Notice> = [];
  users: any[] = [];
  noticeObj!: Notice;
  userObj!: User;
  countbydesignations!: CountByDesignation[];
  arrearsbydivisions!: Arrearsbydivision[];
  countbyschool!: any;
  countbyteacher!: any;
  countbysection!: any;
  countbydivision!: any;

  total!:number[];
  ftext:string = "Total Counts"



  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('columnchart', { static: false }) columnchart: any;
  @ViewChildren('LastSessionPie') LastSessionPie!: QueryList<any>;
  @ViewChildren('OverrallSessionPie') OverrallSessionPie!: QueryList<any>;


  constructor(private rs: ReportService, private router: Router,
              private noticeservice: Noticeservice,
              private userservice: Userservice) {

  }
  cols = '12';
  selectedDate: any;
  latitude  = 6.089832673773971; // Example latitude value
  longitude  = 80.47656690674617;
  // @ts-ignore
  center = { lat: this.latitude, lng: this.longitude };
  markerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 4;
  display?: google.maps.LatLngLiteral;

  onSelect(event: any){
    console.log(event);
    this.selectedDate= event;
  }

  ngOnInit(): void {

    //Pie Chart
    this.rs.countByDesignation()
      .then((des: CountByDesignation[]) => {
        this.countbydesignations = des;
      }).finally(() => {
      this.loadCharts();
    });

    this.rs.countbyschtypediv()
      .then((des: Arrearsbydivision[]) => {
        this.arrearsbydivisions = des;
        console.log(this.arrearsbydivisions);
      }).finally(() => {
      this.loadCharts();
    });
    //School Count
    // @ts-ignore
    this.rs.countbyallqueries().then((sch: Countbyallqueries) => {
      this.countbyschool = sch;
    }).finally(() => {
    })

    //Teacher Count
    // @ts-ignore
    this.rs.countallbyteachers().then((tech: Countbyallqueries) => {
      this.countbyteacher = tech;
    }).finally(() => {
    })

    //Section Count
    // @ts-ignore
    this.rs.countallbysections().then((sec: Countbyallqueries) => {
      this.countbysection = sec;
    }).finally(() => {
    })

    //Division Count
    // @ts-ignore
    this.rs.countallbydivisions().then((div: Countbyallqueries) => {
      this.countbydivision = div;
    }).finally(() => {
    })


    this.noticeservice.getAllByDopublishedAndTitle().then((notic: Notice[]) => {
      this.notices = notic;
      this.noticeObj = JSON.parse(JSON.stringify(this.notices));
    }).finally(() => {
      this.createForm();
    });

    this.userservice.getbyActiveUser().then((users1: User[]) => {
      this.users = users1;
    }).finally(() => {}
    );
  }

  loadUser(){

    // if(this.users.find(s=>s.usertype.id == 1)){
    //   console.log(true)
    // }else {
    //   console.log(false)
    // }
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }
  drawCharts() {


    this.LastSessionPie.forEach((chartElement, index) => {
      const config = this.pieChartConfigs[index];
      config.chartElement = chartElement;
      this.drawPieChart(config.data, config.options, config.chartElement);
    });
    this.OverrallSessionPie.forEach((chartElement, index) => {
      const config = this.pieChartConfigs[index];
      config.chartElement = chartElement;
      this.drawPieChart(config.data, config.options, config.chartElement);
    });

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Designation');
    pieData.addColumn('number', 'Count');


    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'name');
    barData.addColumn('number', '_1AB');
    barData.addColumn('number', '_1C');
    barData.addColumn('number', 'type2');
    barData.addColumn('number', 'type3');

    this.countbydesignations.forEach((des: CountByDesignation) => {
      pieData.addRow([des.designation, des.count]);
    });

    // @ts-ignore
    this.arrearsbydivisions.forEach((abd: Arrearsbydivision) => {
      barData.addRow([abd.name,abd._1C,abd._1AB,abd.type2,abd.type3]);
    });

    const pieOptions = {
      title: 'Designation Count (Pie Chart)',
      height: 400,
      width: 425
    };

    const barOptions = {
      title: 'Division wise School type Count (Bar Chart)',
      subtitle: 'Count of Employees by Designation',
      bars: 'vertical',
      height: 400,
      width: 500,
    };

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const columnChart = new google.visualization.ColumnChart(this.columnchart.nativeElement);
    columnChart.draw(barData, barOptions);
  }
  pieChartConfigs: PieChartConfig[] = [
    {
      data: [
        ['Effort', 'Amount given'],
        ['Reviews', 80],
        ['No Comments', 20],
      ],
      options: {
        title: 'Understandability',
        height: 300,
        width: 200,
        pieHole: 0.5,
        pieSliceTextStyle: {
          color: 'black',
        },
        legend: 'none',
      },
      chartElement: null,
    },

    // {
    //   data: [
    //     ['Effort', 'Amount given'],
    //     ['Reviews', 82],
    //     ['No Comments', 18],
    //   ],
    //   options: {
    //     title: 'Enjoyability',
    //     height: 300,
    //     width: 200,
    //     pieHole: 0.5,
    //     pieSliceTextStyle: {
    //       color: 'black',
    //     },
    //     legend: 'none',
    //   },
    //   chartElement: null,
    // },
    // {
    //   data: [
    //     ['Effort', 'Amount given'],
    //     ['Reviews', 70],
    //     ['No Comments', 30],
    //   ],
    //   options: {
    //     title: 'Punctuality',
    //     height: 300,
    //     width: 200,
    //     pieHole: 0.5,
    //     pieSliceTextStyle: {
    //       color: 'black',
    //     },
    //     legend: 'none',
    //   },
    //   chartElement: null,
    // },
  ];

  drawPieChart(data: any[], options: any, chartElement: any): void {
    const pieData = google.visualization.arrayToDataTable(data);

    const pieChart = new google.visualization.PieChart(chartElement.nativeElement);
    pieChart.draw(pieData, options);
  }


  //Navigation Component
  schoolnavigate() {
    this.router.navigateByUrl("main/school");
  }

  teacherNavigate() {
    this.router.navigateByUrl("main/teacher");
  }

  sectionNavigate() {
    this.router.navigateByUrl("main/section");
  }

  divisionNavigate() {
    this.router.navigateByUrl("main/division");
  }
  noticeNavigate() {
    this.router.navigateByUrl("main/user");
  }

  createForm() {

    // Assuming this.notices is an array of objects with a dopublished property

    // Find the notice object in this.notices with matching dopublished value
    const matchingNotice = this.notices.find(s => s.dopublished === this.noticeObj.dopublished);

    // If a matching notice object is found, assign its dopublished value to noticeObj.dopublished
    if (matchingNotice) {
      this.noticeObj.dopublished = matchingNotice.dopublished;
    }
  }



}
