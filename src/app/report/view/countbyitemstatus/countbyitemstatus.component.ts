import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ReportService } from '../../reportservice';

import {MatTableDataSource} from "@angular/material/table";
import {Countbystaffqualification} from "../../entity/countbystaffqualification";
import {Countbystatus} from "../../entity/countbystatus";
import {Countbyitemstatus} from "../../entity/countbyitemstatus";
import {Countbysectionitem} from "../../entity/countbysectionitem";

declare var google: any;


@Component({
  selector: 'app-countbyitemstatus',
  templateUrl: './countbyitemstatus.component.html',
  styleUrls: ['./countbyitemstatus.component.css']
})
export class CountbyitemstatusComponent implements AfterViewInit {



  countbyitemstatuses!: Countbyitemstatus[];
  countbysectionitems!: Countbysectionitem[];
  data!: MatTableDataSource<Countbyitemstatus>;
  data2!: MatTableDataSource<Countbysectionitem>;

  columns: string[] = ['status', 'count', 'quentity','total','percentage'];
  headers: string[] = ['Item-Status', 'Count', 'No:Quentity','Total-Cost','Percentage'];
  binders: string[] = ['status', 'count','quentity','total', 'percentage'];

  columns2: string[] = ['name', 'actives', 'obsolete','damaged'];
  headers2: string[] = ['Section-Name', 'Active-List', 'Obsolete-List','Damaged-List'];
  binders2: string[] = ['name', 'actives', 'obsolete','damaged'];

  @ViewChild('columnchart2', { static: false }) columnchartRef!: ElementRef;
  @ViewChild('columnchart', { static: false }) columnchartRef2!: ElementRef;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements

  }

  ngAfterViewInit(): void {

    this.rs.countbysectionItem()
      .then((des: Countbysectionitem[]) => {
        this.countbysectionitems = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

    this.rs.countByItemStatus()
      .then((des: Countbyitemstatus[]) => {
        this.countbyitemstatuses = des;
        console.log(this.countbyitemstatuses)
      }).finally(() => {
     this.loadTable();
     this.loadCharts();
    });
  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.countbyitemstatuses);
    this.data2 = new MatTableDataSource(this.countbysectionitems);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'status');
    columnData.addColumn('number', 'quentity');
    columnData.addColumn('number', 'total');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'name');
    lineData.addColumn('number', 'actives');
    lineData.addColumn('number', 'obsolete');
    lineData.addColumn('number', 'damaged');

    this.countbyitemstatuses.forEach((qulify: Countbyitemstatus) => {
      columnData.addRow([qulify.status,qulify.quentity,qulify.total]);
    });

    this.countbysectionitems.forEach((qulify: Countbysectionitem) => {
      lineData.addRow([qulify.name,qulify.actives,qulify.obsolete,qulify.damaged]);
    });

    const barOptions = {
      title: '  Items Summary Report (Bar Chart)',
      bars: 'vertical',  // Set bars to display vertically
      height: 400,
      width: 500,
      hAxis : {title:'Item Status'},
      vAxis : {title:'Item-Cost'},
    };

    const columnoption = {
      title: 'Section Wise Item Status Report (Column Chart)',
      height: 400,
      width: 550,
      hAxis : {title:'Sections'},
      vAxis : {title:'Item Status'},
    };

    this.columnchartRef2 = new google.visualization.ColumnChart(this.columnchartRef2.nativeElement);
    // @ts-ignore
    this.columnchartRef2.draw(columnData, barOptions);

    this.columnchartRef = new google.visualization.ColumnChart(this.columnchartRef.nativeElement);
    // @ts-ignore
    this.columnchartRef.draw(lineData, columnoption);

  }

  printChart() {

    // @ts-ignore
    const imageDataUrl = this.columnchartRef2.getImageURI();
    // @ts-ignore
    const lineData = this.columnchartRef2.container
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

  // printChartBar() {
  //   const imageDataUrl = this.columnchart.getImageURI();
  //   const lineData = this.columnchart.container
  //   const printWindow = window.open('', '_blank');
  //
  //   // @ts-ignore
  //   printWindow.document.open();
  //   // @ts-ignore
  //   printWindow.document.write(`
  //   <html>
  //
  //       <h1 style="text-align: center; font-size: 50px">Zonal Office Akuressa </h1>
  //
  //     <body>
  //       <img src="${imageDataUrl}" style="height: 700px; width: 900px; margin-top: 120px"/>
  //       <script>
  //         window.onload = function() {
  //           setTimeout(function() {
  //             window.print();
  //           }, 1000); // Delay of 1 second (adjust as needed)
  //         };
  //       </script>
  //     </body>
  //   </html>
  // `);
  //   // @ts-ignore
  //   printWindow.document.close();
  // }

}
