import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountByDesignation } from '../../entity/countbydesignation';
import {MatTableDataSource} from "@angular/material/table";
import {Countbystaffqualification} from "../../entity/countbystaffqualification";
import {Countbystatus} from "../../entity/countbystatus";
import {Countbygender} from "../../entity/countbygender";

declare var google: any;


@Component({
  selector: 'app-designation',
  templateUrl: './countbydesignation.component.html',
  styleUrls: ['./countbydesignation.component.css']
})
export class CountByDesignationComponent implements AfterViewInit {

  countbydesignations!: CountByDesignation[];
  countbyqualifications!: Countbystaffqualification[];
  countbystatuses!: Countbystatus[];
  countbygenders!: Countbygender[];

  data!: MatTableDataSource<CountByDesignation>;
  data2!: MatTableDataSource<Countbystaffqualification>;
  data3!: MatTableDataSource<Countbystatus>;
  data4!: MatTableDataSource<Countbygender>;

  columns: string[] = ['designation', 'count', 'percentage'];
  headers: string[] = ['Designation', 'Count', 'Percentage'];
  binders: string[] = ['designation', 'count', 'percentage'];

  columns1: string[] = ['qualification', 'count', 'percentage'];
  headers1: string[] = ['Qualifications', 'Count', 'Percentage'];
  binders1: string[] = ['qualification', 'count', 'percentage'];

  columns2: string[] = ['status', 'count', 'percentage'];
  headers2: string[] = ['Staff-Status', 'Count', 'Percentage'];
  binders2: string[] = ['status', 'count', 'percentage'];

  columns3: string[] = ['section', 'male', 'female'];
  headers3: string[] = ['Section Name', 'Male-Count', 'Female-Count'];
  binders3: string[] = ['section', 'male', 'female'];

  @ViewChild('columnchart', { static: false }) columnchartRef!: ElementRef;
  @ViewChild('piechart', { static: false }) piechartRef!: ElementRef;
  @ViewChild('linechart', { static: false }) linechartRef!: ElementRef;
  @ViewChild('columnchart2', { static: false }) columnchartRef2!: ElementRef;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements

  }

  ngAfterViewInit(): void {

    this.rs.countByDesignation()
      .then((des: CountByDesignation[]) => {
        this.countbydesignations = des;
        }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countByQualification()
      .then((des: Countbystaffqualification[]) => {
        this.countbyqualifications = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countByStatus()
      .then((des: Countbystatus[]) => {
        this.countbystatuses = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countbyGenders()
      .then((des: Countbygender[]) => {
        this.countbygenders = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });
  }


  loadTable() : void{
    this.data = new MatTableDataSource(this.countbydesignations);
    this.data2 = new MatTableDataSource(this.countbyqualifications);
    this.data3 = new MatTableDataSource(this.countbystatuses);
    this.data4 = new MatTableDataSource(this.countbygenders);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'qualification');
    columnData.addColumn('number', 'Count');
    // columnData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Designation');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'status');
    lineData.addColumn('number', 'Count');

    const cloumnData2 = new google.visualization.DataTable();
    cloumnData2.addColumn('string', 'section');
    cloumnData2.addColumn('number', 'male');
    cloumnData2.addColumn('number', 'female');


    // const lineData = new google.visualization.DataTable();
    // lineData.addColumn('string', 'Designation');
    // .addColumn('number', 'Count');

    this.countbydesignations.forEach((des: CountByDesignation) => {
      pieData.addRow([des.designation, des.count]);
     // lineData.addRow([des.designation, des.count]);
    });

    this.countbystatuses.forEach((des: Countbystatus) => {
      console.log(des);
       lineData.addRow([des.status, des.count]);
    });

    this.countbyqualifications.forEach((qulify: Countbystaffqualification) => {
      columnData.addRow([qulify.qualification, qulify.count]);
    });

    this.countbygenders.forEach((qulify: Countbygender) => {
      cloumnData2.addRow([qulify.section, qulify.male,qulify.female]);
    });

    const barOptions = {
      title: 'Qualification wise Staff count (Bar Chart)',
      subtitle: 'Count of Employees by Designation',
      bars: 'vertical',  // Set bars to display vertically
      height: 400,
      width: 500,
      hAxis : {title:'Qualification'},
      vAxis : {title:'Count'},
    };

    const columnOption = {
      title: 'Section wise Gender count (Bar Chart)',
      subtitle: 'Count of Employees by Designation',
      bars: 'vertical',  // Set bars to display vertically
      height: 400,
      width: 500,
      hAxis : {title:'Qualification'},
      vAxis : {title:'Count'},
    };

    const pieOptions = {
      title: 'Designation Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Staff Status Count (Line Chart)',
      height: 400,
      width: 550,
      // hAxis : {title:'boys'},
      // vAxis : {title:'gender'},
    };

    this.columnchartRef = new google.visualization.ColumnChart(this.columnchartRef.nativeElement);
    // @ts-ignore
    this.columnchartRef.draw(columnData, barOptions);

    this.piechartRef = new google.visualization.PieChart(this.piechartRef.nativeElement);
    // @ts-ignore
    this.piechartRef .draw(pieData, pieOptions);

    this.linechartRef = new google.visualization.LineChart(this.linechartRef.nativeElement);
    // @ts-ignore
    this.linechartRef.draw(lineData, lineOptions);

    this.columnchartRef2 = new google.visualization.ColumnChart(this.columnchartRef2.nativeElement);
    // @ts-ignore
    this.columnchartRef2.draw(cloumnData2, columnOption);
  }

  printChart() {
// @ts-ignore
    const imageDataUrl = this.linechartRef.getImageURI();
    // @ts-ignore
    const lineData = this.linechartRef.container
    console.log(lineData);
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
    //@ts-ignore
    const imageDataUrl = this.piechartRef.getImageURI();
    //@ts-ignore
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

  printChartBar() {
    //@ts-ignore
    const imageDataUrl = this.columnchartRef.getImageURI();
    //@ts-ignore
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

  printColumnChart() {
    //@ts-ignore
    const imageDataUrl = this.columnchartRef2.getImageURI();
    //@ts-ignore
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
