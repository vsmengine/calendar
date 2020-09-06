import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { toArray, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  httpBookedDates = [
    { year: 2020, month: 'september', dates: [5, 11, 19, 21, 29] },
    { year: 2020, month: 'november', dates: [5, 11, 19, 21, 29] }
  ]

  constructor() { }

  ngOnInit() {
    
  }
  
}
