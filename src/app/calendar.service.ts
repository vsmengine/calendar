import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  dateInfoSubject = new Subject<any>();
  startNode: number; 
  endNode: number;

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
    this.dateInfoSubject.next(
      {
        'start': startNode,
        'end': endNode
      }
    );
  }

}
