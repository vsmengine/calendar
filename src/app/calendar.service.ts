import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  startNode: number; 
  endNode: number;

  days: number[][] = [];
  weekDays: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  months: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  now = new Date();
  nowYear = this.now.getFullYear();
  nowMonth = this.now.getMonth();

  updatedYear: number;
  updatedMonthNo: number;
  updatedMonth: string;

  bookedDates = [
    {year: 2020, month:'september', dates: [5, 11, 19, 21, 29]}, 
    {year: 2020, month:'november', dates: [5, 11, 19, 21, 29]}
  ];
  newBookingDates = [];
  thisMonthBookedDates = [];
  thisMonthNewBookingDates = [];

  dateNodesSubject = new Subject<any>();
  daysSubject = new Subject<any>();
  calendarSubject = new Subject<any>();
  monthBookedInfoSubject = new Subject<any>();
  monthNewBookingInfoSubject = new Subject<any>();

  constructor() { }

  getStartNode(startDateInfo: number) {
    this.startNode = startDateInfo;
  }

  getEndNode(endDateInfo: number) {
    this.endNode = endDateInfo;
    this.onSelectDates();
  }

  onSelectDates() {
    let startNode = this.startNode;
    let endNode = this.endNode;    
    this.dateNodesSubject.next(
      {'start': startNode, 'end': endNode}
    );
  }

  onInitialLoad() {
    this.updatedYear = this.nowYear;
    this.updatedMonthNo = this.nowMonth;
    this.updatedMonth = this.months[this.updatedMonthNo];
    this.getDaysInMonth(this.nowYear, this.nowMonth);
    this.getSelectedDays();
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
    this.calendarSubject.next({'updatedYear': this.updatedYear, 'updatedMonth': this.updatedMonth});
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
      } this.daysSubject.next(this.days);
    }
  }

  getSelectedDays() {
    this.dateNodesSubject.subscribe((datesInfo) => {
      for(let i = datesInfo['start']; i <= datesInfo['end']; i++) {
        this.checkBookedDate(i);
        this.getThisMonthNewDates();
      }
      // console.log(this.bookedDates);
      // console.log(this.newBookingDates);
    });
  }

  checkBookedDate(selectDate: number) {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if(this.bookedDates[i].year == this.updatedYear && 
        this.bookedDates[i].month == this.updatedMonth && 
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
      if(this.newBookingDates[i].year == this.updatedYear && 
        this.newBookingDates[i].month == this.updatedMonth) {
        this.newBookingDates[i].dates.includes(selectDate) == true ? null : this.newBookingDates[i].dates.push(selectDate);
        return;
      }
    } this.setNewBookingSlot(selectDate);
  }

  setNewBookingSlot(selectDate: number) {
    const newBookingSlot = {
      year: this.updatedYear, 
      month:this.updatedMonth, 
      dates: [selectDate]
    };
    this.newBookingDates.push(newBookingSlot);
  }




  onSelectMonth(selectedMode: string) { 
    selectedMode == 'next' ? this.onNext() : this.onPrev();
    this.updatedMonth = this.months[this.updatedMonthNo];
    this.getDaysInMonth(this.updatedYear, this.updatedMonthNo);
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
    this.calendarSubject.next({'updatedYear': this.updatedYear, 'updatedMonth': this.updatedMonth});
  }

  onNext() {
    if(this.updatedMonthNo == 11) {
      this.updatedMonthNo = 0;
      this.updatedYear += 1;
    } else this.updatedMonthNo += 1;  
  }

  onPrev() {
    if(this.updatedMonthNo == 0) {
      this.updatedMonthNo = 11;
      this.updatedYear -= 1;
    } else this.updatedMonthNo -= 1; 
  }


  
  onLoadThisMonthBookedDates() {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if(this.bookedDates[i].year == this.updatedYear && 
        this.bookedDates[i].month == this.updatedMonth) {
          return this.bookedDates[i];
      }
    } return null;
  }

  onLoadThisMonthNewDates() {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if(this.newBookingDates[i].year == this.updatedYear && 
        this.newBookingDates[i].month == this.updatedMonth) {
          return this.newBookingDates[i];
      }
    } return null;
  }

  getThisMonthBookedDates() {
    this.onLoadThisMonthBookedDates() == null ? this.thisMonthBookedDates = [] : this.thisMonthBookedDates = this.onLoadThisMonthBookedDates().dates;
    this.monthBookedInfoSubject.next(this.thisMonthBookedDates);
  }

  getThisMonthNewDates() {
    this.onLoadThisMonthNewDates() == null ? this.thisMonthNewBookingDates = [] : this.thisMonthNewBookingDates = this.onLoadThisMonthNewDates().dates;
    this.monthNewBookingInfoSubject.next(this.thisMonthNewBookingDates);
  }

}
