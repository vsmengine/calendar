import { Component, OnInit, Input } from '@angular/core';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  @Input() allBookedDates: number[];

  selectedYear: number;
  selectedMonth: string;
  selectedMonthDates: number[][] = [];
  selectedMonthBookedDates: number[] = [];
  selectedMonthNewBookingDates: number[] = [];

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.onSubscribeData();
    this.onSetBookedDates();
    this.onLoadCalendar();
  }

  onSetBookedDates() {
    this.calendarService.setBookedDates(this.allBookedDates);
  }

  onLoadCalendar() {
    this.calendarService.loadCalendar();
  }

  onSelectMonth(selectedMode: string) {
    this.calendarService.selectMonth(selectedMode);
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
