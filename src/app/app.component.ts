import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { toArray, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  days: number[][] = [];
  weekDays: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  months: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  now = new Date();
  nowYear = this.now.getFullYear();
  nowMonth = this.now.getMonth();

  selectedYear: number;
  selectedMonthNo: number;
  selectedMonthName: string;

  // bookedDates = {september: [5, 11, 19, 21, 29]};
  // newBookingDates = {september: []};
  bookedDates = [{year: 2020, month:'september', dates: [5, 11, 19, 21, 29]}];
  newBookingDates = [{year: 2020, month:'september', dates: []}];

  constructor(
    private calendarService: CalendarService,
  ) {
    this.onInitialLoad();
    this.getSelectedDays()
  }

  onInitialLoad() {
    this.selectedYear = this.nowYear;
    this.selectedMonthNo = this.nowMonth;
    this.selectedMonthName = this.months[this.selectedMonthNo];
    this.getDaysInMonth(this.nowYear, this.nowMonth);
  }

  onSelectMonth(selectedMode: string) { 
    selectedMode == 'next' ? this.onNext() : this.onPrev();
    this.selectedMonthName = this.months[this.selectedMonthNo];
    this.getDaysInMonth(this.selectedYear, this.selectedMonthNo);
  }

  onNext() {
    if(this.selectedMonthNo == 11) {
      this.selectedMonthNo = 0;
      this.selectedYear += 1;
    } else
    this.selectedMonthNo += 1;  
  }

  onPrev() {
    if(this.selectedMonthNo == 0) {
      this.selectedMonthNo = 11;
      this.selectedYear -= 1;
    } else
    this.selectedMonthNo -= 1; 
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


  // getMatchBookedDates() {
  //   for (let i = 0; i < this.bookedDates.length; i++) {
  //     if(this.bookedDates[i].year == this.selectedYear && this.bookedDates[i].month == this.selectedMonthName) {
  //       return this.bookedDates[i];
  //     }
  //   }
  // }

  // setNewBooking() {
  //   for (let i = 0; i < this.newBookingDates.length; i++) {
  //     if(this.newBookingDates[i].year == this.selectedYear && this.newBookingDates[i].month == this.selectedMonthName) {
  //       return this.newBookingDates[i];
  //     } else {
  //       const newObj = {
  //         year: this.selectedYear, 
  //         month:this.selectedMonthName, 
  //         dates: []
  //       };
  //       this.newBookingDates.push(newObj);
  //       return this.newBookingDates[this.newBookingDates.length - 1];
  //     }
  //   }
  // }



  setNewBookingSlot(selectDate) {
    const newObj = {
      year: this.selectedYear, 
      month:this.selectedMonthName, 
      dates: [selectDate]
    };
    this.newBookingDates.push(newObj);
  }

  checkNewBookingDate(selectDate) {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if(this.newBookingDates[i].year == this.selectedYear && 
        this.newBookingDates[i].month == this.selectedMonthName) {
        this.newBookingDates[i].dates.includes(selectDate) == true ? null : this.newBookingDates[i].dates.push(selectDate);
        return;
      }
    }
    this.setNewBookingSlot(selectDate);
  }

  setNewBookingDate(selectDate) {
    this.newBookingDates.length == 0 ? this.setNewBookingSlot(selectDate) : this.checkNewBookingDate(selectDate);
  }

  checkBookedDate(selectDate) {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if(this.bookedDates[i].year == this.selectedYear && 
        this.bookedDates[i].month == this.selectedMonthName && 
        this.bookedDates[i].dates.includes(selectDate) == true) {
          return null;
      }
    }
    this.setNewBookingDate(selectDate);
  }

  // setNewBookingDate(selectDate) {
  //   this.checkBookedDate(selectDate) == null ? null : this.checkNewBookingDate(selectDate);
  // }

  getSelectedDays() {
    this.calendarService.dateInfoSubject.subscribe((datesInfo) => {
      for(let i = datesInfo['start']; i <= datesInfo['end']; i++) {
        this.checkBookedDate(i);
      }
      console.log(this.bookedDates);
      console.log(this.newBookingDates);
    });
  }

}
