import {Component, Directive, EventEmitter, OnInit, Output, ViewChild,} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {TooltipPosition} from "@angular/material/tooltip";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {ConfirmComponent} from "../../util/dialog/confirm/confirm.component";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {AuthorizationManager} from "../../service/authorizationmanager";


@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css'],
})


export class MainwindowComponent implements OnInit{

  sidenavOpen = false;
  sidenaveMode = 'side';

  currentDateTime: string = '';

  constructor(private router: Router, private breakpointObserver: BreakpointObserver,public authService: AuthorizationManager) {
    breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
    ]).subscribe(reslut => {
      for (const query of Object.keys(reslut.breakpoints)) {
        if (reslut.breakpoints[query]) {
          this.sidenavOpen = true;
          this.sidenaveMode = 'side';
        }else{
          this.sidenavOpen = false;
          this.sidenaveMode = 'side';
        }
      }
    });
  }

  ngOnInit(): void {
    this.sidenavOpen = true;
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    this.currentDateTime = now.toLocaleString('en-US', options);
    return this.currentDateTime;
  }


  close(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = !this.sidenavOpen;
    }
  }

  opened: boolean=true;

  logout(): void {
    this.router.navigateByUrl("login");
    this.authService.clearUsername();
    this.authService.clearPhoto();
    this.authService.clearButtonState();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");
  }


  AdminmenuItems = this.authService.AdminmenuItems;
  SubjectmenuItems = this.authService.SubjectmenuItems;
  MemberRegmenuItems = this.authService.MemberRegmenuItems;
  EventmenuItems = this.authService.EventmenuItems;
  SectionalmenuItems = this.authService.SectionalmenuItems;
  SchoolmenuItems = this.authService.SchoolmenuItems;
  DivisionalmenuItems = this.authService.DivisionalmenuItems;
  ZonalmenuItems = this.authService.ZonalmenuItems;
  EvaluationmenuItems = this.authService.EvaluationmenuItems;

  isMenuVisible(category: string): boolean {
    switch (category) {
      case 'Admin':
        return this.AdminmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Subject':
        return this.SubjectmenuItems.some(menuItem => menuItem.accessFlag);
      case 'School':
        return this.SchoolmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Member':
        return this.MemberRegmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Event':
        return this.EventmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Sectional':
        return this.SectionalmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Divisional':
        return this.DivisionalmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Zonal':
        return this.ZonalmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Evaluation':
        return this.EvaluationmenuItems.some(menuItem => menuItem.accessFlag);

      default:
        return false;
    }
  }

  onToggle($event: MatSlideToggleChange) {
      // @ts-ignore
    const element = document.querySelector("app-mainwindow").children[0].children[1].children[4];
    element.classList.toggle("dark");
    element.classList.toggle("dark1");
  }

}


