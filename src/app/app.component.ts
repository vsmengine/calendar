import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { toArray, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  selectedYear: number;
  selectedMonth: string;
  selectedMonthDates: number[][] = [];
  selectedMonthBookedDates: number[] = [];
  selectedMonthNewBookingDates: number[] = [];

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.onSubscribeData();
    this.calendarService.onInitialLoad();
  }

  onSelectMonth(selectedMode: string) {
    this.calendarService.onSelectMonth(selectedMode);
  }

  onSubscribeData() {
    this.calendarService.calendarInfoSubject.subscribe((data) => {
      this.selectedYear = data.thisYear;
      this.selectedMonth = data.thisMonth;
      this.selectedMonthDates = data.thisMonthDates;
      this.selectedMonthBookedDates = data.thisMonthBookedDates;
      this.selectedMonthNewBookingDates = data.thisMonthNewBookingDates;
    });
  }
  
}
