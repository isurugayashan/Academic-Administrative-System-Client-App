import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ReportService } from '../../reportservice';
import {MatTableDataSource} from "@angular/material/table";
import {Countbydivision} from "../../entity/countbydivision";
import {Countbyallqueries} from "../../entity/countbyallqueries";
import {Countbyschlevel} from "../../entity/countbyschlevel";
import {Countbylesssubject} from "../../entity/countbylesssubject";
import {Countbysubjectmedium} from "../../entity/countbysubjectmedium";
import {Subleveltotalteachercount} from "../../entity/subleveltotalteachercount";

declare var google: any;


@Component({
  selector: 'app-schtype',
  templateUrl: './countbysubject.component.html',
  styleUrls: ['./countbysubject.component.css']
})
export class CountbysubjectComponent implements AfterViewInit {



  countbylesssubjects!: Countbylesssubject[];
   countbysubjectmediums!: Countbysubjectmedium[];
   subleveltotalteachercounts!: Subleveltotalteachercount[];
  // countbyschlevels!: Countbyschlevel[];

  data!: MatTableDataSource<Countbylesssubject>;
  data2!: MatTableDataSource<Countbysubjectmedium>;
  data3!: MatTableDataSource<Subleveltotalteachercount>;

  columns: string[] = ['subject', 'count', 'percentage'];
  headers: string[] = ['Subject', 'Count', 'Percentage'];
  binders: string[] = ['subject', 'count', 'percentage'];

  columns2: string[] = ['medium', 'count', 'percentage'];
  headers2: string[] = ['Medium', 'Count', 'Percentage'];
  binders2: string[] = ['medium', 'count', 'percentage'];

  columns3: string[] = ['sublevelName', 'subjectCount', 'maleCount','femaleCount','totalCount'];
  headers3: string[] = ['Subject- Levels', 'Registered Subject-Count', 'Male-Teachers','Female-Teachers','Total Teacher-Count'];
  binders3: string[] = ['sublevelName', 'subjectCount', 'maleCount','femaleCount','totalCount'];

  @ViewChild('barchart', { static: false }) columnchartRef!: ElementRef;
  @ViewChild('piechart', { static: false }) piechartRef!: ElementRef;
  @ViewChild('columnchart', { static: false }) columnchartRef2!: ElementRef

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements

  }

  ngAfterViewInit(): void {

    this.rs.countByLessSubject()
      .then((des: Countbylesssubject[]) => {
        this.countbylesssubjects = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countBySubjectMedium()
      .then((des: Countbysubjectmedium[]) => {
        this.countbysubjectmediums = des;
      }).finally(() => {
       this.loadTable();
      this.loadCharts();
    });
    //
    this.rs.subleveltotalteachercounts()
      .then((des: Subleveltotalteachercount[]) => {
        this.subleveltotalteachercounts = des;
      }).finally(() => {
       this.loadTable();
      this.loadCharts();
    });

  }


  loadTable() : void{
    this.data = new MatTableDataSource(this.countbylesssubjects);
    this.data2 = new MatTableDataSource(this.countbysubjectmediums);
    this.data3 = new MatTableDataSource(this.subleveltotalteachercounts);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Subject');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'medium');
    pieData.addColumn('number', 'Count');

    const columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'sublevelName');
    columnData.addColumn('number', 'subjectCount');
    columnData.addColumn('number', 'maleCount');
    columnData.addColumn('number', 'femaleCount');
    columnData.addColumn('number', 'totalCount');

    //
    // const lineData = new google.visualization.DataTable();
    // lineData.addColumn('string', 'Schlevel');
    // lineData.addColumn('number', 'Count');

    this.countbysubjectmediums.forEach((submedium: Countbysubjectmedium) => {
      pieData.addRow([submedium.medium, submedium.count]);
    });

    this.countbylesssubjects.forEach((subject: Countbylesssubject) => {
      barData.addRow([subject.subject, subject.count]);
    });

    this.subleveltotalteachercounts.forEach((levels: Subleveltotalteachercount) => {
      columnData.addRow([levels.sublevelName, levels.subjectCount,levels.maleCount,levels.femaleCount,levels.totalCount]);
    });

    const barOptions = {
      title: 'Count of Subject less than 10 teachers (Bar Chart)',
      subtitle: 'Count of Schools by Division wise',
      bars: 'vertical',  // Set bars to display vertically
      height: 400,
      width: 500,
    };

    const pieOptions = {
      title: 'Subject count medium wise All Subject levels (Pie Chart)',
      height: 400,
      width: 550
    };

    const columnOption = {
      title: 'Subject vs Teacher gender Distribution (Column Chart)',
      height: 400,
      width: 550,
      hAxis : {title:'Subject Levels'},
      vAxis : {title:'Count'},
    };

    this.columnchartRef = new google.visualization.ColumnChart(this.columnchartRef.nativeElement);
    // @ts-ignore
    this.columnchartRef.draw(barData, barOptions);

    this.piechartRef = new google.visualization.PieChart(this.piechartRef.nativeElement);
    // @ts-ignore
    this.piechartRef.draw(pieData, pieOptions);

    this.columnchartRef2 = new google.visualization.ColumnChart(this.columnchartRef2.nativeElement);
    // @ts-ignore
    this.columnchartRef2.draw(columnData, columnOption);
  }

  printChart() {
    // @ts-ignore
    const imageDataUrl = this.columnchartRef.getImageURI();
    // @ts-ignore
    const lineData = this.columnchartRef.container
    const printWindow = window.open('', '_blank');

    // @ts-ignore
    printWindow.document.open();
    // @ts-ignore
    printWindow.document.write(`
    <html>

        <h1 style="text-align: center; font-size: 50px">Zonal Office Akuressa </h1>

      <body>
        <img src="${imageDataUrl}" style="height: 700px; width: 900px; margin-top: 120px"/>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 1000); // Delay of 1 second (adjust as needed)
          };
        </script>
      </body>
    </html>
  `);
    // @ts-ignore
    printWindow.document.close();
  }


  printChartPie() {
    // @ts-ignore
    const imageDataUrl = this.piechartRef.getImageURI();
    // @ts-ignore
    const lineData = this.piechartRef.container
    const printWindow = window.open('', '_blank');

    // @ts-ignore
    printWindow.document.open();
    // @ts-ignore
    printWindow.document.write(`
    <html>

        <h1 style="text-align: center; font-size: 50px">Zonal Office Akuressa </h1>

      <body>
        <img src="${imageDataUrl}" style="height: 700px; width: 900px; margin-top: 120px"/>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 1000); // Delay of 1 second (adjust as needed)
          };
        </script>
      </body>
    </html>
  `);
    // @ts-ignore
    printWindow.document.close();
  }

  printChartLine() {
    // @ts-ignore
    const imageDataUrl = this.columnchartRef2.getImageURI();
    // @ts-ignore
    const lineData = this.columnchartRef2.container
    const printWindow = window.open('', '_blank');

    // @ts-ignore
    printWindow.document.open();
    // @ts-ignore
    printWindow.document.write(`
    <html>

        <h1 style="text-align: center; font-size: 50px">Zonal Office Akuressa </h1>

      <body>
        <img src="${imageDataUrl}" style="height: 700px; width: 900px; margin-top: 120px"/>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 1000); // Delay of 1 second (adjust as needed)
          };
        </script>
      </body>
    </html>
  `);
    // @ts-ignore
    printWindow.document.close();
  }
}
