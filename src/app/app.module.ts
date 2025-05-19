import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './view/home/home.component';
import {LoginComponent} from './view/login/login.component';
import {MainwindowComponent} from './view/mainwindow/mainwindow.component';
import {UserComponent} from './view/modules/user/user.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule, MatHint} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DashboardComponent } from './view/dashboard/dashboard.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {LayoutModule} from "@angular/cdk/layout";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatBadge, MatBadgeModule} from "@angular/material/badge";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ChartComponent } from './util/chart/chart.component';
import {NgChartsModule} from "ng2-charts";
import {Chart} from "chart.js";
import {CalendarModule} from "./util/calendar/calendar.module";
import { StaffComponent } from './view/modules/staff/staff.component';
import {MatTableModule} from "@angular/material/table";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ConfirmComponent} from "./util/dialog/confirm/confirm.component";
import {DatePipe} from "@angular/common";
import {Staffservice} from "./service/staffservice";
import { TeacherComponent } from './view/modules/teacher/teacher.component';
import { SchoolComponent } from './view/modules/school/school.component';
import { DivisionComponent } from './view/modules/division/division.component';
import {GoogleMapsModule} from "@angular/google-maps";
import { SectionComponent } from './view/modules/section/section.component';
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import { CountbyschtypeComponent } from './report/view/countbyschtype/countbyschtype.component';
import {ArrearsByProgramComponent} from "./report/view/arrearsbyprogram/arrearsbyprogram.component";
import {MatChipsModule} from "@angular/material/chips";
import {LinkComponent} from "./view/link/link.component";
import { ProgramComponent } from './view/modules/program/program.component';
import { SubjectComponent } from './view/modules/subject/subject.component';
import { MeetingComponent } from './view/modules/meeting/meeting/meeting.component';
import { ItemComponent } from './view/modules/item/item.component';
import { StarRatingComponent } from './util/star-rating/star-rating.component';
import { NoticeComponent } from './view/modules/notice/notice.component';
import { ReviewComponent } from './view/modules/review/review.component';
import { CountbysubjectComponent } from './report/view/countbysubject/countbysubject.component';
import { DirectorsubjectComponent } from './view/modules/directorsubject/directorsubject.component';
import { StaffsectionComponent } from './view/modules/staffsection/staffsection.component';
import { StaffdivisionComponent } from './view/modules/staffdivision/staffdivision.component';
import { SchassignComponent } from './view/modules/schassign/schassign.component';
import { ProgressComponent } from './view/modules/progress/progress.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { CountbyitemstatusComponent } from './report/view/countbyitemstatus/countbyitemstatus.component';
import { ProgressreviewComponent } from './view/modules/progressreview/progressreview.component';
import { PrivilageComponent } from './view/modules/privilage/privilage.component';
import { CountbyweeksComponent } from './report/view/countbyweeks/countbyweeks.component';
import {AuthorizationManager} from "./service/authorizationmanager";
import {JwtInterceptor} from "./service/JwtInterceptor";
import {AuthenticateService} from "./service/AuthenticateService";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainwindowComponent,
    StaffComponent,
    UserComponent,
    MessageComponent,
    DashboardComponent,
    ChartComponent,
    StaffComponent,
    ConfirmComponent,
    TeacherComponent,
    SchoolComponent,
    DivisionComponent,
    SectionComponent,
    CountByDesignationComponent,
    CountbyschtypeComponent,
    ArrearsByProgramComponent,
    LinkComponent,
    ProgramComponent,
    SubjectComponent,
    MeetingComponent,
    ItemComponent,
    StarRatingComponent,
    NoticeComponent,
    ReviewComponent,
    CountbysubjectComponent,
    DirectorsubjectComponent,
    StaffsectionComponent,
    StaffdivisionComponent,
    SchassignComponent,
    ProgressComponent,
    CountbyitemstatusComponent,
    ProgressreviewComponent,
    PrivilageComponent,
    CountbyweeksComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    FlexLayoutModule,
    LayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    NgChartsModule,
    CalendarModule,
    MatTableModule,
    HttpClientModule,
    MatPaginatorModule,
    GoogleMapsModule,
    MatChipsModule,
    NgSelectModule,
    MatAutocompleteModule,


  ],
  providers: [Staffservice,DatePipe,AuthorizationManager,AuthenticateService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
