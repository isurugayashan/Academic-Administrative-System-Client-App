import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import {ChartComponent} from "./util/chart/chart.component";
import {StaffComponent} from "./view/modules/staff/staff.component";
import {TeacherComponent} from "./view/modules/teacher/teacher.component";
import {SchoolComponent} from "./view/modules/school/school.component";
import {DivisionComponent} from "./view/modules/division/division.component";
import {SectionComponent} from "./view/modules/section/section.component";
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {CountbyschtypeComponent} from "./report/view/countbyschtype/countbyschtype.component";
import {ArrearsByProgramComponent} from "./report/view/arrearsbyprogram/arrearsbyprogram.component";
import {LinkComponent} from "./view/link/link.component";
import {ProgramComponent} from "./view/modules/program/program.component";
import {SubjectComponent} from "./view/modules/subject/subject.component";
import {MeetingComponent} from "./view/modules/meeting/meeting/meeting.component";
import {ItemComponent} from "./view/modules/item/item.component";
import {StarRatingComponent} from "./util/star-rating/star-rating.component";
import {NoticeComponent} from "./view/modules/notice/notice.component";
import {ReviewComponent} from "./view/modules/review/review.component";
import {Countbylesssubject} from "./report/entity/countbylesssubject";
import {CountbysubjectComponent} from "./report/view/countbysubject/countbysubject.component";
import {DirectorsubjectComponent} from "./view/modules/directorsubject/directorsubject.component";
import {StaffsectionComponent} from "./view/modules/staffsection/staffsection.component";
import {StaffdivisionComponent} from "./view/modules/staffdivision/staffdivision.component";
import {SchassignComponent} from "./view/modules/schassign/schassign.component";
import {ProgressComponent} from "./view/modules/progress/progress.component";
import {CountbyitemstatusComponent} from "./report/view/countbyitemstatus/countbyitemstatus.component";
import {ProgressreviewComponent} from "./view/modules/progressreview/progressreview.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {CountbyweeksComponent} from "./report/view/countbyweeks/countbyweeks.component";


const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "charts", component: ChartComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      { path: "dashboard/school", component: SchoolComponent },
      {path: "staff", component: StaffComponent},
      {path: "teacher", component: TeacherComponent},
      {path: "school", component: SchoolComponent},
      {path: "user", component: UserComponent},
      {path: "division", component: DivisionComponent},
      {path: "section", component: SectionComponent},
      {path: "link", component: LinkComponent},
      {path: "program", component: ProgramComponent},
      {path: "subject", component: SubjectComponent},
      {path: "meeting", component: MeetingComponent},
      {path: "item", component: ItemComponent},
      {path: "star", component: StarRatingComponent},
      {path: "notice", component: NoticeComponent},
      {path: "review", component: ReviewComponent},
      {path: "privilege", component: PrivilageComponent},
      {path: "report-countbydesignation", component: CountByDesignationComponent},
      {path: "report-countbyschtype", component: CountbyschtypeComponent},
      {path: "report-arrearsbyprogram", component: ArrearsByProgramComponent},
      {path: "report-countbysubject", component: CountbysubjectComponent},
      {path: "report-countbyitemstatus", component: CountbyitemstatusComponent},
      {path: "directorsubjects", component: DirectorsubjectComponent},
      {path: "staffsection", component: StaffsectionComponent},
      {path: "staffdivision", component: StaffdivisionComponent},
      {path: "schassign", component: SchassignComponent},
      {path: "progress", component: ProgressComponent},
      {path: "progress-review", component: ProgressreviewComponent},
      {path: "reoprt-countbyweek", component: CountbyweeksComponent},
    ],
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
