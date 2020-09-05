import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { toArray, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  days: number[][] = [];

  selectedYear: number;
  selectedMonth: string;

  thisMonthBookedDates = [];
  thisMonthNewBookingDates = [];

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.onSubscribeData();
    this.calendarService.onInitialLoad();
    //this.calendarService.getSelectedDays();
  }

  onSelectMonth(selectedMode: string) {
    this.calendarService.onSelectMonth(selectedMode);
  }

  onSubscribeData() {
    this.calendarService.calendarSubject.subscribe((data) => {
      this.selectedYear = data['updatedYear'];
      this.selectedMonth = data['updatedMonth'];
    });
    this.calendarService.daysSubject.subscribe((data) => {
      this.days = data
    });
    this.calendarService.monthBookedInfoSubject.subscribe((data) => {
      this.thisMonthBookedDates = data
    });
    this.calendarService.monthNewBookingInfoSubject.subscribe((data) => {
      this.thisMonthNewBookingDates = data
    });
  }

}
