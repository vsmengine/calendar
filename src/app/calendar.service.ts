import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  startNode: number; 
  endNode: number;
  dateNodesSubject = new Subject<any>();

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

}
