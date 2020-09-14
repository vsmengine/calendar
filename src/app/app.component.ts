import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { toArray, tap } from 'rxjs/operators';
import { booking } from './booking.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  newBookingDates: booking[];
  bookedDates: booking[] = [
    { year: 2020, month: 'september', dates: [5, 11, 19, 21, 29] },
    { year: 2020, month: 'november', dates: [5, 11, 19, 21, 29] }
  ]
  months: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  weekDays: string[] = ['s', 'm', 't', 'w', 't', 'f', 's'];

  constructor() {

  }

  getCalInfo(data: any) {
    this.newBookingDates = data.allNewBookingDates;
  }
  
}
