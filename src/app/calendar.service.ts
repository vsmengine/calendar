import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  now: Date = new Date();
  nowYear: number = this.now.getFullYear();
  nowMonth: number = this.now.getMonth();

  months: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  weekDays: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
   
  updatedYear: number; 
  updatedMonthNo: number; 
  updatedMonth: string;
  startNode: number;
  endNode: number;

  thisMonthDates: number[][] = [];
  bookedDates = [];
  newBookingDates = [];
  thisMonthBookedDates = [];
  thisMonthNewBookingDates = [];

  calendarInfoSubject = new Subject<any>();

  constructor() { }

  loadCalendar() {
    this.setVariables();
    this.getDaysInMonth(this.nowYear, this.nowMonth);
    this.getSelectedDays();
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
    this.emitSubscribedData();
  }

  setBookedDates(allBookedDates) {
    this.bookedDates = allBookedDates;
  }
  
  setVariables() {
    this.updatedYear = this.nowYear;
    this.updatedMonthNo = this.nowMonth;
    this.updatedMonth = this.months[this.nowMonth];
  }

  getDaysInMonth(year: number, month: number) {
    let newDate = new Date(year, month, 1);
    for (let week = 0; week < 5; week++) {
      this.thisMonthDates[week] = [];
      for (let day = newDate.getDay(); day < 7; day++) {
        if (newDate.getMonth() === month) {
          this.thisMonthDates[week][day] = newDate.getDate();
          newDate.setDate(newDate.getDate() + 1);
        }
      }
      this.emitSubscribedData();
    }
  }

  getDateNodes(nodeLabel: string, nodeInfo: number) {
    if (nodeLabel == 'startNode') {
      this.startNode = nodeInfo;
      return;
    } else this.endNode = nodeInfo;
    this.getSelectedDays();
    this.emitSubscribedData();
  }

  getSelectedDays() {
    for (let i = this.startNode; i <= this.endNode; i++) {
      this.checkBookedDate(i);
      this.getThisMonthNewDates();
    }
  }

  checkBookedDate(selectDate: number) {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if (this.bookedDates[i].year == this.updatedYear &&
        this.bookedDates[i].month == this.updatedMonth &&
        this.bookedDates[i].dates.includes(selectDate) == true) {
        return null;
      }
    } this.setNewBookingDate(selectDate);
  }

  setNewBookingDate(selectDate: number) {
    if (this.newBookingDates.length != 0) {
      this.checkNewBookingDate(selectDate);
    } else this.setNewBookingSlot(selectDate);
  }

  checkNewBookingDate(selectDate: number) {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if (this.newBookingDates[i].year == this.updatedYear &&
        this.newBookingDates[i].month == this.updatedMonth) {
        this.newBookingDates[i].dates.includes(selectDate) == true
          ? this.newBookingDates[i].dates = this.newBookingDates[i].dates.filter(
            (date) => date !== selectDate)
          : this.newBookingDates[i].dates.push(selectDate);
        return;
      }
    } this.setNewBookingSlot(selectDate);
  }

  setNewBookingSlot(selectDate: number) {
    const newBookingSlot = {
      year: this.updatedYear,
      month: this.updatedMonth,
      dates: [selectDate]
    };
    this.newBookingDates.push(newBookingSlot);
  }

  selectMonth(selectedMode: string) {
    selectedMode == 'next' ? this.moveNext() : this.movePrev();
    this.updatedMonth = this.months[this.updatedMonthNo];
    this.getDaysInMonth(this.updatedYear, this.updatedMonthNo);
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
    this.emitSubscribedData();
  }

  moveNext() {
    if (this.updatedMonthNo == 11) {
      this.updatedMonthNo = 0;
      this.updatedYear += 1;
    } else this.updatedMonthNo += 1;
  }

  movePrev() {
    if (this.updatedMonthNo == 0) {
      this.updatedMonthNo = 11;
      this.updatedYear -= 1;
    } else this.updatedMonthNo -= 1;
  }

  loadThisMonthBookedDates() {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if (this.bookedDates[i].year == this.updatedYear &&
        this.bookedDates[i].month == this.updatedMonth) {
        return this.bookedDates[i];
      }
    } return null;
  }

  loadThisMonthNewDates() {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if (this.newBookingDates[i].year == this.updatedYear &&
        this.newBookingDates[i].month == this.updatedMonth) {
        return this.newBookingDates[i];
      }
    } return null;
  }

  getThisMonthBookedDates() {
    this.loadThisMonthBookedDates() == null
      ? this.thisMonthBookedDates = []
      : this.thisMonthBookedDates = this.loadThisMonthBookedDates().dates;
    this.emitSubscribedData();
  }

  getThisMonthNewDates() {
    this.loadThisMonthNewDates() == null
      ? this.thisMonthNewBookingDates = []
      : this.thisMonthNewBookingDates = this.loadThisMonthNewDates().dates;
    this.emitSubscribedData();
  }

  emitSubscribedData() {
    this.calendarInfoSubject.next({
      'thisYear': this.updatedYear,
      'thisMonth': this.updatedMonth,
      'thisMonthDates': this.thisMonthDates,
      'thisMonthBookedDates': this.thisMonthBookedDates,
      'thisMonthNewBookingDates': this.thisMonthNewBookingDates,
      'selectionStartNode': this.startNode,
      'selectionEndNode': this.endNode,
      'allNewBookingDates': this.newBookingDates,
    });
  }

}
