import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { booking } from '../booking.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, OnDestroy {

  @Input() bookedDates: booking[];
  @Input() monthsOfYear: string[];
  @Input() daysOfWeek: string[];
  @Output() emitCalInfo = new EventEmitter<any>();
  subscription: Subscription;

  weekDays: string[];
  selectedYear: number;
  selectedMonth: string;
  selectedMonthDates: number[][];
  selectedMonthBookedDates: number[];
  selectedMonthNewBookingDates: number[];
  selectedMonthNewHoveringDates: number[];

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.onSetExternalData();
    this.onLoadCalendar();
    this.subscription = this.calendarService.calendarInfoSubject.subscribe((data) => {
      this.emitCalInfo.emit(data);
      this.weekDays = data.daysOfWeek;
      this.selectedYear = data.thisYear;
      this.selectedMonth = data.thisMonth;
      this.selectedMonthDates = data.thisMonthDates;
      this.selectedMonthBookedDates = data.thisMonthBookedDates;
      this.selectedMonthNewBookingDates = data.thisMonthNewBookingDates;
      this.selectedMonthNewHoveringDates = data.thisMonthNewHoveringDates;
    }); 
  }

  async onLoadCalendar() {
    await this.calendarService.loadCalendar();
  }

  async onSetExternalData() {
    const externalData = {
      "bookedDates": this.bookedDates,
      "monthsOfYear": this.monthsOfYear,
      "daysOfWeek": this.daysOfWeek,
    }
    await this.calendarService.setExternalData(externalData);
  }

  onSelectMonth(selectedDirection: string) {
    this.calendarService.selectMonth(selectedDirection);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
