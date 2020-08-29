import { Component, OnInit } from '@angular/core';

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

  selectedMonthNo: number;
  selectedMonthName: string;

  constructor() {
    this.defaultLoad();
  }

  defaultLoad() {
    this.selectedMonthNo = this.nowMonth
    this.selectedMonthName = this.months[this.selectedMonthNo];
    this.getDaysInMonth(this.nowYear, this.nowMonth);
  }

  onSelectMonth(selectedMode: string) { 
    selectedMode == 'next' ? this.selectedMonthNo += 1 : this.selectedMonthNo -= 1;
    this.selectedMonthName = this.months[this.selectedMonthNo];
    this.getDaysInMonth(this.nowYear, this.selectedMonthNo);
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



}
