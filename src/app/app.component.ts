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
  weekDays: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  months: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  now = new Date();
  nowYear = this.now.getFullYear();
  nowMonth = this.now.getMonth();

  selectedYear: number;
  selectedMonthNo: number;
  selectedMonth: string;

  bookedDates = [
    {year: 2020, month:'september', dates: [5, 11, 19, 21, 29]}, 
    {year: 2020, month:'november', dates: [5, 11, 19, 21, 29]}
  ];
  newBookingDates = [];
  thisMonthBookedDates = [];
  thisMonthNewBookingDates = [];

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.onInitialLoad();
    this.getDaysInMonth(this.nowYear, this.nowMonth);
    this.getSelectedDays();
  }

  onInitialLoad() {
    this.selectedYear = this.nowYear;
    this.selectedMonthNo = this.nowMonth;
    this.selectedMonth = this.months[this.selectedMonthNo];
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
  }

  getDaysInMonth(year: number, month: number) {
    let newDate = new Date(year, month, 1);
    for (let week = 0; week < 5; week++) {
      this.days[week] = [];
      for (let day = newDate.getDay(); day < 7; day++) {
        if(newDate.getMonth() === month) {
          this.days[week][day] = newDate.getDate();
          newDate.setDate(newDate.getDate() + 1);
        }
      };
    };
  }

  getSelectedDays() {
    this.calendarService.dateNodesSubject.subscribe((datesInfo) => {
      for(let i = datesInfo['start']; i <= datesInfo['end']; i++) {
        this.checkBookedDate(i);
        this.getThisMonthNewDates();
      }
      console.log(this.bookedDates);
      console.log(this.newBookingDates);
    });
  }

  checkBookedDate(selectDate: number) {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if(this.bookedDates[i].year == this.selectedYear && 
        this.bookedDates[i].month == this.selectedMonth && 
        this.bookedDates[i].dates.includes(selectDate) == true) {
          return null;
      }
    } this.setNewBookingDate(selectDate);
  }

  setNewBookingDate(selectDate: number) {
    if(this.newBookingDates.length != 0) {
      this.checkNewBookingDate(selectDate);
    } else this.setNewBookingSlot(selectDate);
  }

  checkNewBookingDate(selectDate: number) {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if(this.newBookingDates[i].year == this.selectedYear && 
        this.newBookingDates[i].month == this.selectedMonth) {
        this.newBookingDates[i].dates.includes(selectDate) == true ? null : this.newBookingDates[i].dates.push(selectDate);
        return;
      }
    } this.setNewBookingSlot(selectDate);
  }

  setNewBookingSlot(selectDate: number) {
    const newBookingSlot = {
      year: this.selectedYear, 
      month:this.selectedMonth, 
      dates: [selectDate]
    };
    this.newBookingDates.push(newBookingSlot);
  }




  onSelectMonth(selectedMode: string) { 
    selectedMode == 'next' ? this.onNext() : this.onPrev();
    this.selectedMonth = this.months[this.selectedMonthNo];
    this.getDaysInMonth(this.selectedYear, this.selectedMonthNo);
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
  }

  onNext() {
    if(this.selectedMonthNo == 11) {
      this.selectedMonthNo = 0;
      this.selectedYear += 1;
    } else this.selectedMonthNo += 1;  
  }

  onPrev() {
    if(this.selectedMonthNo == 0) {
      this.selectedMonthNo = 11;
      this.selectedYear -= 1;
    } else this.selectedMonthNo -= 1; 
  }


  
  onLoadThisMonthBookedDates() {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if(this.bookedDates[i].year == this.selectedYear && 
        this.bookedDates[i].month == this.selectedMonth) {
          return this.bookedDates[i];
      }
    } return null;
  }

  onLoadThisMonthNewDates() {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if(this.newBookingDates[i].year == this.selectedYear && 
        this.newBookingDates[i].month == this.selectedMonth) {
          return this.newBookingDates[i];
      }
    } return null;
  }

  getThisMonthBookedDates() {
    this.onLoadThisMonthBookedDates() == null ? this.thisMonthBookedDates = [] : this.thisMonthBookedDates = this.onLoadThisMonthBookedDates().dates;
  }

  getThisMonthNewDates() {
    this.onLoadThisMonthNewDates() == null ? this.thisMonthNewBookingDates = [] : this.thisMonthNewBookingDates = this.onLoadThisMonthNewDates().dates;
  }

}
