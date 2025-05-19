import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountBySchtype } from '../../entity/countbyschtype';
import {MatTableDataSource} from "@angular/material/table";
import {Countbydivision} from "../../entity/countbydivision";
import {Countbyallqueries} from "../../entity/countbyallqueries";
import {Countbyschlevel} from "../../entity/countbyschlevel";
import {Countbyschgender} from "../../entity/countbyschgender";
import {Countbyschstudent} from "../../entity/countbyschstudent";

declare var google: any;


@Component({
  selector: 'app-schtype',
  templateUrl: './countbyschtype.component.html',
  styleUrls: ['./countbyschtype.component.css']
})
export class CountbyschtypeComponent implements AfterViewInit {



  countbyschtypes!: CountBySchtype[];
  countbydivisions!: Countbydivision[];
  countbyschlevels!: Countbyschlevel[];
  countbyschgenders!:Countbyschgender[];
  countbyschstudents!:Countbyschstudent[]

  data!: MatTableDataSource<CountBySchtype>;
  data2!: MatTableDataSource<Countbydivision>;
  data3!: MatTableDataSource<Countbyschlevel>;
  data4!: MatTableDataSource<Countbyschgender>;
  data5!: MatTableDataSource<Countbyschstudent>;


  columns: string[] = ['schtype', 'count', 'percentage'];
  headers: string[] = ['School-Type', 'Count', 'Percentage'];
  binders: string[] = ['schtype', 'count', 'percentage'];

  columns1: string[] = ['division', 'count', 'percentage'];
  headers1: string[] = ['Division', 'Count', 'Percentage'];
  binders1: string[] = ['division', 'count', 'percentage'];

  columns2: string[] = ['schlevel', 'count', 'percentage'];
  headers2: string[] = ['School-Level', 'Count', 'Percentage'];
  binders2: string[] = ['schlevel', 'count', 'percentage'];

  columns3: string[] = ['gedner', 'count', 'percentage'];
  headers3: string[] = ['Gender', 'Count', 'Percentage'];
  binders3: string[] = ['gedner', 'count', 'percentage'];

  columns4: string[] = ['schStudentName', 'boys', 'girls','mixed'];
  headers4: string[] = ['Student', 'Boys-Schools', 'Girls-Schools','Mixed-Schools'];
  binders4: string[] = ['schStudentName', 'boys', 'girls','mixed'];


  total!:number[];
  ftext:string = "Total Counts"

  @ViewChild('barchart', { static: false }) columnchartRef!: ElementRef;
  @ViewChild('columnchart', { static: false }) columnchartRef2!: ElementRef;
  @ViewChild('piechart', { static: false }) piechartRef!: ElementRef;
  @ViewChild('piechart2', { static: false }) piechart2Ref!: ElementRef;
  @ViewChild('linechart', { static: false }) linechartRef!: ElementRef;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements

  }

  ngAfterViewInit(): void {
    this.rs.countbyschtype()
      .then((des: CountBySchtype[]) => {
        this.countbyschtypes = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countbydivision()
      .then((des: Countbydivision[]) => {
        this.countbydivisions = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countbyschlevel()
      .then((des: Countbyschlevel[]) => {
        this.countbyschlevels = des;
        console.log(this.countbyschlevels)
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countbyschgender()
      .then((des: Countbyschgender[]) => {
        this.countbyschgenders = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countbyschstudent()
      .then((des: Countbyschstudent[]) => {
        this.countbyschstudents = des;
        console.log(this.countbyschstudents)
      }).finally(() => {
      this.loadTable();
    });
  }


  loadTable() : void{
    this.data = new MatTableDataSource(this.countbyschtypes);
    this.data2 = new MatTableDataSource(this.countbydivisions);
    this.data3 = new MatTableDataSource(this.countbyschlevels);
    this.data4 = new MatTableDataSource(this.countbyschgenders);
    this.data5 = new MatTableDataSource(this.countbyschstudents);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'Division');
    columnData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();

    pieData.addColumn('string', 'Schtype');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Schlevel');
    lineData.addColumn('number', 'Count');

    const pieData2 = new google.visualization.DataTable();
    pieData2.addColumn('string', 'gedner');
    pieData2.addColumn('number', 'count');
    pieData2.addColumn('number', 'percentage');

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'schStudentName');
    barData.addColumn('number', 'boys');
    barData.addColumn('number', 'girls');
    barData.addColumn('number', 'mixed');

    this.countbyschgenders.forEach((abp: Countbyschgender) => {
      pieData2.addRow([abp.gedner, abp.count,abp.perecentage]);
    });

    this.countbyschtypes.forEach((schtype: CountBySchtype) => {
      pieData.addRow([schtype.schtype, schtype.count]);
    });

    this.countbydivisions.forEach((divisions: Countbydivision) => {
      columnData.addRow([divisions.division, divisions.count]);
    });

    this.countbyschlevels.forEach((levels: Countbyschlevel) => {
      lineData.addRow([levels.schlevel, levels.count]);
    });

    this.countbyschstudents.forEach((abp: Countbyschstudent) => {
      barData.addRow([abp.schStudentName, abp.boys,abp.girls,abp.mixed]);
    });

    const columnOption = {
      title: 'School Gender Variety Depends Student Count (Column Chart)',
      subtitle: 'Count of Employees by Designation',
      bars: 'vertical',
      height: 400,
      width: 600,
    };

    const barOptions = {
      title: 'Count of Schools by Division wise (Bar Chart)',
      subtitle: 'Count of Schools by Division wise',
      bars: 'vertical',  // Set bars to display vertically
      height: 400,
      width: 500,
      hAxis : {title:'Division'},
      vAxis : {title:'Count'},
    };

    const pieOptions = {
      title: 'School Types distribution (Pie Chart)',
      height: 400,
      width: 550
    };

    const pieOptions2 = {
      title: 'School Gender distribution (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'School Level distribution (Line Chart)',
      height: 400,
      width: 550
    };

    this.columnchartRef = new google.visualization.ColumnChart(this.columnchartRef.nativeElement);
    // @ts-ignore
    this.columnchartRef.draw(columnData, barOptions);

    this.piechartRef = new google.visualization.PieChart(this.piechartRef.nativeElement);
    // @ts-ignore
    this.piechartRef.draw(pieData, pieOptions);

    this.piechart2Ref = new google.visualization.PieChart(this.piechart2Ref.nativeElement);
    // @ts-ignore
    this.piechart2Ref.draw(pieData2, pieOptions2);

    this.linechartRef = new google.visualization.LineChart(this.linechartRef.nativeElement);
    // @ts-ignore
    this.linechartRef.draw(lineData, lineOptions);

    this.columnchartRef2 = new google.visualization.ColumnChart(this.columnchartRef2.nativeElement);
    // @ts-ignore
    this.columnchartRef2.draw(barData, columnOption);
  }

  printChart() {

    // @ts-ignore
    const imageDataUrl = this.linechartRef.getImageURI();
    // @ts-ignore
    const lineData = this.linechartRef.container
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
    const pieDate = this.piechartRef.container
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
    const imageDataUrl = this.columnchartRef.getImageURI();
    // @ts-ignore
    const pieData = this.columnchartRef.container
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

  printChartPie2() {
    // @ts-ignore
    const imageDataUrl = this.piechart2Ref.getImageURI();
    // @ts-ignore
    const pieDate = this.piechart2Ref.container
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

  printChartColomun() {
    // @ts-ignore
    const imageDataUrl = this.columnchartRef2.getImageURI();
    const printWindow = window.open('', '_blank');
    // @ts-ignore
    const colData = this.columnchartRef2.container

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
