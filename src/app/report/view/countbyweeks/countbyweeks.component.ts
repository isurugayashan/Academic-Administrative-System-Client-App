import {AfterViewInit, Component} from '@angular/core';
import {Countbylesssubject} from "../../entity/countbylesssubject";
import {Countbysubjectmedium} from "../../entity/countbysubjectmedium";
import {Subleveltotalteachercount} from "../../entity/subleveltotalteachercount";
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Countbyweeks} from "../../entity/countbyweeks";


@Component({
  selector: 'app-countbyweeks',
  templateUrl: './countbyweeks.component.html',
  styleUrls: ['./countbyweeks.component.css']
})
export class CountbyweeksComponent implements AfterViewInit{

  countbyweeks!: Countbyweeks[];


  data!: MatTableDataSource<Countbyweeks>;


  columns: string[] = ['dofrom', 'tofrom', 'progressCount','teacherCount'];
  headers: string[] = ['From-Date', 'To-Date', 'Total-Number of Progress','Teacher-Number of Progress'];
  binders: string[] = ['dofrom', 'tofrom', 'progressCount','teacherCount'];


  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements

  }

  ngAfterViewInit(): void {
    this.rs.countByProgressWeek()
      .then((des: Countbyweeks[]) => {
        this.countbyweeks = des;
        console.log(this.countbyweeks)
      }).finally(() => {
      this.loadTable();
    });
  }

  private loadTable() {
    this.data = new MatTableDataSource(this.countbyweeks);
  }
}
