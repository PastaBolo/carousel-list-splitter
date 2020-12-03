import { ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { trigger, state, style, transition, group, query, animate, animateChild } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

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
          animate('5000ms ease-in-out', style({ transform: 'translateX(calc(-1 * (100% + {{spacing}}px) / ({{n}} + 1)))' })),
          query(':leave', animate('5000ms ease-in-out'))
        ])
      ]),
      transition('* => previous', [
        style({ transform: 'translateX(calc(-1 * (100% + {{spacing}}px) / ({{n}} + 1)))' }),
        group([
          animate('5000ms ease-in-out', style({ transform: 'none' })),
          query(':leave', animate('5000ms ease-in-out'))
        ])
      ])
    ])
  ]
})
export class CarouselComponent {
  @ContentChildren(CarouselItemDirective, { read: TemplateRef }) items: QueryList<TemplateRef<any>>;

  @Input()
  set position(position: NumberInput) { this._position = coerceNumberProperty(position, 0); }
  get position() { return this._position; }
  private _position = 0;

  @Input()
  set cyclic(cyclic: BooleanInput) { this._cyclic = coerceBooleanProperty(cyclic); }
  get cyclic() { return this._cyclic; }
  private _cyclic = false;

  @Input() visibleElements = 1;

  @Input() spacing = 0;

  direction: 'previous' | 'next' | null = null;
  animating = false;

  previous() {
    this.position = modulo(+this.position - 1, this.items.length);
    this.direction = 'previous';
  }

  next() {
    this.position = modulo(+this.position + 1, this.items.length);
    this.direction = 'next';
  }

  containerWidth() {
    const n = this.visibleElements;
    const spacing = this.spacing;
    return `calc((${(n + 1) * 100}% + ${spacing}px)/${n})`;
  }

  itemWidth() {
    const n = this.visibleElements;
    const spacing = this.spacing;
    return `calc((100% - ${n * spacing}px)/${n + 1})`;
  }
}
