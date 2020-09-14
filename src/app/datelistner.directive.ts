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
    this.calendarService.getSelectedNodes('startNode', +event.target['innerHTML']);
  }

  @HostListener('mouseup', ['$event']) onMouseup(event: MouseEvent) {
    this.calendarService.getSelectedNodes('endNode', +event.target['innerHTML']);
  }

  @HostListener('mouseenter', ['$event']) onMouseenter(event: MouseEvent) {
    this.calendarService.getHoverNodes('enterNode', +event.target['innerHTML']);
  }

  @HostListener('mouseleave', ['$event']) onMouseleave(event: MouseEvent) {
    this.calendarService.getHoverNodes('leaveNode', +event.target['innerHTML']);
  }

}
