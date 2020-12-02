import { ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, pluck, shareReplay, tap } from 'rxjs/operators';

import { CarouselComponent } from './carousel/carousel.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @ViewChildren(CarouselComponent) carousels: QueryList<CarouselComponent>;

  list = [
    { value: 1, size: 2 },
    { value: 2, size: 1 },
    { value: 3, size: 1 },
    { value: 4, size: 2 },
    { value: 5, size: 1 },
    { value: 6, size: 1 },
    { value: 7, size: 2 },
    { value: 8, size: 1 }
  ];

  chunkSize$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      pluck('breakpoints'),
      map(breakpoints => breakpoints[Breakpoints.XSmall] ? 1 : breakpoints[Breakpoints.Small] ? 2 : 3),
      tap(() => this.carousels?.toArray().forEach(carousel => carousel.position = 0)),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  itemSizeStrategy = item => item.size;
}
