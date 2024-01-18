import {AfterViewInit, Directive, ElementRef, HostListener, inject, Input, Renderer2} from "@angular/core";

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements AfterViewInit {
  @Input() color: string = "lightyellow";

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    this.setBackgroundColor(this.color);
  }

  setBackgroundColor(color: string) : void {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.setBackgroundColor('lightblue');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBackgroundColor(this.color);
  }

  @HostListener('click') onClick() {
    this.color = 'lightblue';
  }
}
