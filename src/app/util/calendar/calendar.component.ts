import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {DayPilot, DayPilotCalendarComponent, DayPilotNavigatorComponent} from "@daypilot/daypilot-lite-angular";
import {DataService} from "./data.service";

@Component({
  selector: 'calendar-component',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild("navigator") navigator!: DayPilotNavigatorComponent;
  @ViewChild("calendar") calendar!: DayPilotCalendarComponent;

  get date(): DayPilot.Date {
    return this.config.startDate as DayPilot.Date;
  }

  set date(value: DayPilot.Date) {
    this.config.startDate = value;
  }

  navigatorConfig: DayPilot.NavigatorConfig = {
    showMonths: 2,
    skipMonths: 3,
    selectMode: "Week",
    cellWidth: 30,
    cellHeight: 30,
    dayHeaderHeight: 30,
    titleHeight: 30
  };

  events: DayPilot.EventData[] = [];

  config: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    viewType: "Week",
    cellHeight: 25,
    headerHeight: 25,
    hourWidth: 60,
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Create a new event:");
      const dp = args.control;
      dp.clearSelection();
      if (!modal.result) { return; }
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result
      });
    },
    eventDeleteHandling: "Update",
    onEventDeleted: (args) => {
      // @ts-ignore
      args['control'].message("Event deleted: " + args['e'].text());
    },

  };

  constructor(private ds: DataService) {
  }

  ngAfterViewInit(): void {
  }

  viewChange(): void {
    var from = this.calendar.control.visibleStart();
    var to = this.calendar.control.visibleEnd();

    console.log("viewChange(): " + from + " " + to);

    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }

  navigatePrevious(event: MouseEvent): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(-7);
  }

  navigateNext(event: MouseEvent): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(7);
  }

  navigateToday(event: MouseEvent): void {
    event.preventDefault();
    this.config.startDate = DayPilot.Date.today();
  }

}

