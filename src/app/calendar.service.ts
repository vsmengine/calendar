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
  bookedDates = [
    { year: 2020, month: 'september', dates: [5, 11, 19, 21, 29] },
    { year: 2020, month: 'november', dates: [5, 11, 19, 21, 29] }
  ];
 
  updatedYear: number; 
  updatedMonthNo: number; 
  updatedMonth: string;
  startNode: number;
  endNode: number;

  thisMonthDates: number[][] = [];
  newBookingDates = [];
  thisMonthBookedDates = [];
  thisMonthNewBookingDates = [];

  calendarInfoSubject = new Subject<any>();

  constructor() { }

  onInitialLoad() {
    this.onInitVariables();
    this.getDaysInMonth(this.nowYear, this.nowMonth);
    this.getSelectedDays();
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
    this.onEmitSubscribedData();
  }

  onInitVariables() {
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
      this.onEmitSubscribedData();
    }
  }

  getDateNodes(nodeLabel: string, nodeInfo: number) {
    if (nodeLabel == 'startNode') {
      this.startNode = nodeInfo;
      return;
    } else this.endNode = nodeInfo;
    this.getSelectedDays();
    this.onEmitSubscribedData();
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
          ? null
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

  onSelectMonth(selectedMode: string) {
    selectedMode == 'next' ? this.onNext() : this.onPrev();
    this.updatedMonth = this.months[this.updatedMonthNo];
    this.getDaysInMonth(this.updatedYear, this.updatedMonthNo);
    this.getThisMonthBookedDates();
    this.getThisMonthNewDates();
    this.onEmitSubscribedData();
  }

  onNext() {
    if (this.updatedMonthNo == 11) {
      this.updatedMonthNo = 0;
      this.updatedYear += 1;
    } else this.updatedMonthNo += 1;
  }

  onPrev() {
    if (this.updatedMonthNo == 0) {
      this.updatedMonthNo = 11;
      this.updatedYear -= 1;
    } else this.updatedMonthNo -= 1;
  }

  onLoadThisMonthBookedDates() {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if (this.bookedDates[i].year == this.updatedYear &&
        this.bookedDates[i].month == this.updatedMonth) {
        return this.bookedDates[i];
      }
    } return null;
  }

  onLoadThisMonthNewDates() {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if (this.newBookingDates[i].year == this.updatedYear &&
        this.newBookingDates[i].month == this.updatedMonth) {
        return this.newBookingDates[i];
      }
    } return null;
  }

  getThisMonthBookedDates() {
    this.onLoadThisMonthBookedDates() == null
      ? this.thisMonthBookedDates = []
      : this.thisMonthBookedDates = this.onLoadThisMonthBookedDates().dates;
    this.onEmitSubscribedData();
  }

  getThisMonthNewDates() {
    this.onLoadThisMonthNewDates() == null
      ? this.thisMonthNewBookingDates = []
      : this.thisMonthNewBookingDates = this.onLoadThisMonthNewDates().dates;
    this.onEmitSubscribedData();
  }

  onEmitSubscribedData() {
    this.calendarInfoSubject.next({
      'thisYear': this.updatedYear,
      'thisMonth': this.updatedMonth,
      'thisMonthDates': this.thisMonthDates,
      'thisMonthBookedDates': this.thisMonthBookedDates,
      'thisMonthNewBookingDates': this.thisMonthNewBookingDates,
      'selectionStartNode': this.startNode,
      'selectionEndNode': this.endNode,
      'allNewBookingDates': this.newBookingDates,
      'allBookedDates': this.bookedDates,
    });
  }

}
