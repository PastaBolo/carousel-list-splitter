import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, pluck, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  list = [
    { value: 0, size: 2 },
    { value: 1, size: 1 },
    { value: 2, size: 1 },
    { value: 3, size: 2 },
    { value: 4, size: 1 },
    { value: 5, size: 1 },
    { value: 6, size: 2 },
    { value: 7, size: 1 }
  ];

  chunkSize$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      pluck('breakpoints'),
      map(breakpoints => breakpoints[Breakpoints.XSmall] ? 1 : breakpoints[Breakpoints.Small] ? 2 : 3),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  itemSizeStrategy = item => item.size;
}
