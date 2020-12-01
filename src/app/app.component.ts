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

  list = [1, 2, 3, 4, 5, 6, 7, 8];

  chunkSizeBreakpoints$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      pluck('breakpoints'),
      map(breakpoints => breakpoints[Breakpoints.XSmall] ? 1 : breakpoints[Breakpoints.Small] ? 2 : 3),
      tap(() => this.carousels?.toArray().forEach(carousel => carousel.position = 0)),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

}
