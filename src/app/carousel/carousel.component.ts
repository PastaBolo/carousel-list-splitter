import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { asyncScheduler, BehaviorSubject, combineLatest, fromEvent, merge, noop, of } from 'rxjs';
import { debounceTime, filter, map, mapTo, observeOn, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { CarouselItemDirective } from './carousel-item.directive';

declare type Page = { position: number };
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent {
  @ContentChildren(CarouselItemDirective, { read: TemplateRef }) items: QueryList<TemplateRef<any>>;
  @ViewChildren('displayedItem') displayedItems: QueryList<ElementRef>;

  items$ = of(noop).pipe(
    observeOn(asyncScheduler),
    switchMap(() => this.items.changes.pipe(startWith(this.items))),
    map(queryList => queryList.toArray()),
    startWith([]),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  @Input()
  set stopAtTheEnd(stopAtTheEnd: BooleanInput) { this._stopAtTheEnd = coerceBooleanProperty(stopAtTheEnd); }
  get stopAtTheEnd() { return this._stopAtTheEnd; }
  private _stopAtTheEnd = false;

  @Input()
  set resetPositionIfChanges(reset: boolean) { this._resetPositionIfChanges = coerceBooleanProperty(reset); }
  get resetPositionIfChanges() { return this._resetPositionIfChanges; }
  private _resetPositionIfChanges = false;

  @Input()
  set position(position: NumberInput) { this._position$.next(coerceNumberProperty(position, 0)); }
  private _position$ = new BehaviorSubject(0);
  position$ = merge(
    this._position$.asObservable(),
    this.items$.pipe(filter(() => this.resetPositionIfChanges), mapTo(0))
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  @Input()
  set visibleElements(visibleElements: NumberInput) { this.visibleElements$.next(coerceNumberProperty(visibleElements, 1)); }
  visibleElements$ = new BehaviorSubject(1);

  @Input()
  set pageSize(pageSize: NumberInput) { this._pageSize$.next(coerceNumberProperty(pageSize)); }
  private _pageSize$ = new BehaviorSubject(0);
  pageSize$ = combineLatest([this._pageSize$.asObservable(), this.visibleElements$]).pipe(
    map(([pageSize, visibleElements]) => pageSize ? Math.min(pageSize, visibleElements) : visibleElements),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  @Input()
  set spacing(spacing: NumberInput) { this._spacing = coerceNumberProperty(spacing, 0); }
  get spacing() { return this._spacing; }
  private _spacing = 0;

  pages$ = combineLatest([this.items$, this.pageSize$, this.visibleElements$]).pipe(
    map(([items, pageSize, visibleElements]) =>
      Array(Math.ceil((items.length - visibleElements) / pageSize + 1)).fill(null)
        .map((_, i) => ({
          position: this.stopAtTheEnd
            ? Math.min(i * pageSize, items.length - visibleElements)
            : i * pageSize
        }))
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  currentPage$ = combineLatest([this.pages$, this.position$]).pipe(
    map(([pages, position]) => pages.filter(page => page.position <= position).length - 1),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  itemPositions$ = fromEvent(window, 'resize').pipe(
    debounceTime(30),
    map(() => this.itemPositions),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  get itemPositions() {
    if (this.displayedItems) {
      const firstItemPosition = this.displayedItems.toArray()[0].nativeElement.getBoundingClientRect().left;
      return this.displayedItems.toArray().map(item => item.nativeElement.getBoundingClientRect().left - firstItemPosition);
    }
    else { return []; }
  }

  goToPage(i: number, pages: Page[]) {
    this._position$.next(pages[i].position);
  }
}
