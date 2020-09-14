import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { booking } from './booking.model';

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
  hoverNode: number;

  thisMonthDates: number[][];
  bookedDates: booking[];
  newBookingDates: booking[];
  newHoveringDates: number[];
  thisMonthBookedDates: number[];
  thisMonthNewBookingDates: number[];

  calendarInfoSubject = new Subject<any>();

  constructor() { }

  // Set external data to inner variables
  async setExternalData(externalData: any) {
    externalData.bookedDates ? this.bookedDates = externalData.bookedDates : this.bookedDates;
    externalData.monthsOfYear ? this.months = externalData.monthsOfYear : this.months;
    externalData.daysOfWeek ? this.weekDays = externalData.daysOfWeek : this.weekDays;
  }

  // Initiate calendar
  async loadCalendar() {
    await this.setVariables();
    await this.getDaysInMonth(this.nowYear, this.nowMonth);
    await this.getSelectedDays();
    await this.getThisMonthBookedDates();
    await this.getThisMonthNewDates();
    this.emitSubscribedData();
  }
  
  // Initialize variables
  async setVariables() {
    this.thisMonthDates = [];
    this.newBookingDates = [];
    this.newHoveringDates = [];
    this.thisMonthBookedDates = [];
    this.thisMonthNewBookingDates = [];
    this.updatedYear = this.nowYear;
    this.updatedMonthNo = this.nowMonth;
    this.updatedMonth = this.months[this.nowMonth];
  }

  // Get all dates in a specific month
  async getDaysInMonth(year: number, month: number) {
    let thisMonthStart = new Date(year, month, 1);

    for (let week = 0; week < 5; week++) {
      this.thisMonthDates[week] = [];
      for (let day = thisMonthStart.getDay(); day < 7; day++) {
        if (thisMonthStart.getMonth() === month) {
          this.thisMonthDates[week][day] = thisMonthStart.getDate();
          thisMonthStart.setDate(thisMonthStart.getDate() + 1);
        }
      } 
      this.emitSubscribedData();
    }
  }

  // Get hovered node details
  getHoverNodes(nodeLabel: string, nodeInfo: number) {
    if (nodeLabel == 'enterNode' && nodeInfo > this.startNode) {
      this.hoverNode = nodeInfo;
    }
    this.getHoveredDays();
    this.emitSubscribedData();
  }

  // Get all sequential hovering nodes
  async getHoveredDays() {
    this.newHoveringDates = [];
    if(this.startNode != null) {
      for (let i = this.startNode; i <= this.hoverNode; i++) {
        await this.checkBookedDate(i) === null ? null : this.newHoveringDates.push(i);
      }
    }
  }

  // Get selected node details
  getSelectedNodes(nodeLabel: string, nodeInfo: number) {
    if (nodeLabel == 'startNode') {
      this.startNode = nodeInfo;
      return;
    } else this.endNode = nodeInfo;
    this.hoverNode = null;
    this.newHoveringDates = [];
    this.getSelectedDays();
    this.emitSubscribedData();
  }

  // Get all selected nodes
  async getSelectedDays() {
    for (let i = this.startNode; i <= this.endNode; i++) {
      await this.checkBookedDate(i) === null ? null : this.setNewBookingDate(i);
      this.getThisMonthNewDates();
      this.startNode = null;
      // console.log(this.newBookingDates);
    }
  }

  // Set a new booking date
  async setNewBookingDate(selectDate: number) {
    if (this.newBookingDates.length != 0) {
      await this.checkNewBookingDate(selectDate) === null ? null : this.setNewBookingSlot(selectDate);
    } else { 
      await this.setNewBookingSlot(selectDate); 
    }
  }

  // Set a new booking slot
  async setNewBookingSlot(selectDate: number) {
    const newBookingSlot = {
      year: this.updatedYear,
      month: this.updatedMonth,
      dates: [selectDate]
    };
    this.newBookingDates.push(newBookingSlot);
  }

  // Check whether a selected date is already exsists in booked dates
  async checkBookedDate(selectDate: number) {
    for (let i = 0; i < this.bookedDates.length; i++) {
      if (this.bookedDates[i].year == this.updatedYear &&
        this.bookedDates[i].month == this.updatedMonth &&
        this.bookedDates[i].dates.includes(selectDate) == true) {
        return null;
      }
    } return selectDate;
  }

  // Check whether a selected date is already selected
  async checkNewBookingDate(selectDate: number) {
    for (let i = 0; i < this.newBookingDates.length; i++) {
      if (this.newBookingDates[i].year == this.updatedYear &&
        this.newBookingDates[i].month == this.updatedMonth) {
          this.newBookingDates[i].dates.includes(selectDate) == true
          ? this.newBookingDates[i].dates = this.newBookingDates[i].dates.filter(
            (date: number) => date !== selectDate)
          : this.newBookingDates[i].dates.push(selectDate);
          this.newBookingDates[i].dates = this.newBookingDates[i].dates.sort(
            (a, b) => {return a - b;}
          );
        return null;
      }
    } return selectDate;
  }

  // Select any month in calendar
  async selectMonth(selectedDirection: string) {
    selectedDirection == 'next' ? this.moveNext() : this.movePrev();
    this.updatedMonth = this.months[this.updatedMonthNo];
    await this.getDaysInMonth(this.updatedYear, this.updatedMonthNo);
    await this.getThisMonthBookedDates();
    await this.getThisMonthNewDates();
    this.emitSubscribedData();
  }

  // Move calendar month to foward
  moveNext() {
    if (this.updatedMonthNo == 11) {
      this.updatedMonthNo = 0;
      this.updatedYear += 1;
    } else this.updatedMonthNo += 1;
  }

  // Move calendar month to backward
  movePrev() {
    if (this.updatedMonthNo == 0) {
      this.updatedMonthNo = 11;
      this.updatedYear -= 1;
    } else this.updatedMonthNo -= 1;
  }

  // Check any date is available for current year and month
  checkThisMonthDates(bookingDates: booking[]) {
    for (let i = 0; i < bookingDates.length; i++) {
      if (bookingDates[i].year == this.updatedYear &&
        bookingDates[i].month == this.updatedMonth) {
        return bookingDates[i].dates;
      }
    } return null;
  }

  // Get already booked dates relavant to this month
  async getThisMonthBookedDates() {
    let thisMonthDates = this.checkThisMonthDates(this.bookedDates);
    thisMonthDates == null
      ? this.thisMonthBookedDates = []
      : this.thisMonthBookedDates = thisMonthDates;
    this.emitSubscribedData();
  }

  // Get new booking dates relavant to this month
  async getThisMonthNewDates() {
    let thisMonthDates = this.checkThisMonthDates(this.newBookingDates);
    thisMonthDates == null
      ? this.thisMonthNewBookingDates = []
      : this.thisMonthNewBookingDates = thisMonthDates;
    this.emitSubscribedData();
  }

  // Emit all subscribed data
  emitSubscribedData() {
    this.calendarInfoSubject.next({
      'monthsOfYear': this.months,
      'daysOfWeek': this.weekDays,
      'thisYear': this.updatedYear,
      'thisMonth': this.updatedMonth,
      'thisMonthDates': this.thisMonthDates,
      'thisMonthBookedDates': this.thisMonthBookedDates,
      'thisMonthNewBookingDates': this.thisMonthNewBookingDates,
      'thisMonthNewHoveringDates': this.newHoveringDates,
      'selectionStartNode': this.startNode,
      'selectionEndNode': this.endNode,
      'allBookedDates': this.bookedDates,
      'allNewBookingDates': this.newBookingDates,
    });
  }

}
