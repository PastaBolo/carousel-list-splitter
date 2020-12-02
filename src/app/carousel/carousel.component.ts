import { ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { trigger, state, style, transition, group, query, animate } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

import { CarouselItemDirective } from '../carousel-item.directive';

const modulo = (x: number, n: number) => ((x % n) + n) % n;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('*', style({ position: 'relative' })),
      transition('* => previous', [
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('300ms ease-in-out', style({ transform: 'none' }))
          ]),
          query(':leave', [
            style({ position: 'absolute', left: 0 }),
            animate('300ms ease-in-out', style({ left: '100%' }))
          ])
        ])
      ]),
      transition('* => next', [
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('300ms ease-in-out', style({ transform: 'none' }))
          ]),
          query(':leave', [
            style({ position: 'absolute', right: 0 }),
            animate('300ms ease-in-out', style({ right: '100%' }))
          ])
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
  set circular(circular: BooleanInput) { this._circular = coerceBooleanProperty(circular); }
  get circular() { return this._circular; }
  private _circular = false;

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
}
