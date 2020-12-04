import { ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { trigger, style, transition, group, query, animate } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

import { CarouselItemDirective } from './carousel-item.directive';

const modulo = (x: number, n: number) => ((x % n) + n) % n;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      transition('* => next', [
        group([
          animate('1000ms ease-in-out', style({ transform: 'translateX(calc(-{{translate}} / ({{m}} + {{n}}) * (100% + {{spacing}}px)))' })),
          query(':leave', animate(1000))
        ])
      ]),
      transition('* => previous', [
        style({ transform: 'translateX(calc(-{{translate}} / ({{m}} + {{n}}) * (100% + {{spacing}}px)))' }),
        group([
          animate('1000ms ease-in-out', style({ transform: 'none' })),
          query(':leave', animate(1000))
        ])
      ])
    ])
  ]
})
export class CarouselComponent {
  @ContentChildren(CarouselItemDirective, { read: TemplateRef }) items: QueryList<TemplateRef<any>>;

  @Input()
  set cyclic(cyclic: BooleanInput) { this._cyclic = coerceBooleanProperty(cyclic); }
  get cyclic() { return this._cyclic; }
  private _cyclic = false;

  @Input()
  set stopAtTheEnd(stopAtTheEnd: BooleanInput) { this._stopAtTheEnd = coerceBooleanProperty(stopAtTheEnd); }
  get stopAtTheEnd() { return this._stopAtTheEnd; }
  private _stopAtTheEnd = false;

  @Input()
  set position(position: number) { this._position = coerceNumberProperty(position, 0); }
  get position() { return this._position; }
  private _position = 0;

  @Input()
  set visibleElements(visibleElements: number) { this._visibleElements = coerceNumberProperty(visibleElements, 1); }
  get visibleElements() { return this._visibleElements; }
  private _visibleElements = 1;

  @Input()
  set sliderSize(sliderSize: number) { this._sliderSize = coerceNumberProperty(sliderSize, 1); }
  get sliderSize() { return this._sliderSize; }
  private _sliderSize = 1;

  @Input()
  set spacing(spacing: number) { this._spacing = coerceNumberProperty(spacing, 0); }
  get spacing() { return this._spacing; }
  private _spacing = 0;

  direction: 'previous' | 'next' | null = null;
  animating = false;
  translate: number;

  previous() {
    if (this.stopAtTheEnd) { this.translate = Math.min(this.sliderSize, this.position); }
    else { this.translate = this.sliderSize; }
    this.position = modulo(this.position - this.translate, this.items.length);
    // this.translate = this.sliderSize;
    // this.position = modulo(this.position - this.sliderSize, this.items.length);
    this.direction = 'previous';
  }

  next() {
    if (this.stopAtTheEnd) { this.translate = Math.min(this.sliderSize, this.items.length - (this.position + this.visibleElements)); }
    else { this.translate = this.sliderSize; }
    this.position = modulo(this.position + this.translate, this.items.length);
    // this.translate = this.sliderSize;
    // this.position = modulo(this.position + this.sliderSize, this.items.length);
    this.direction = 'next';
  }

  containerWidth() {
    const n = this.visibleElements;
    const m = this.sliderSize;
    const spacing = this.spacing;
    return `calc((${(m + n) * 100}% + ${m * spacing}px)/${n})`;
  }

  itemWidth() {
    const n = this.visibleElements;
    const m = this.sliderSize;
    const spacing = this.spacing;
    return `calc((100% - ${(m + n - 1) * spacing}px)/${m + n})`;
  }
}
