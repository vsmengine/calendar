import { Directive, HostListener, HostBinding, ElementRef, Renderer2 } from '@angular/core';
import { CalendarService } from './calendar.service';

@Directive({
  selector: '[appDatelistner]'
})
export class DatelistnerDirective {

  constructor(
    private calendarService: CalendarService,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) { }

  @HostListener('mousedown', ['$event']) onMousedown(event: MouseEvent) {
    this.calendarService.getDateNodes('startNode', +event.target['innerHTML']);
  }

  @HostListener('mouseup', ['$event']) onMouseup(event: MouseEvent) {
    // this.calendarService.onSelectDates(event.target['innerHTML']);
    this.calendarService.getDateNodes('endNode', +event.target['innerHTML']);
  }


}
