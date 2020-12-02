import { Directive, Input } from '@angular/core';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Directive({
  selector: '[listSplitter]',
  exportAs: 'listSplitter'
})
export class ListSplitterDirective {
  @Input('listSplitter')
  set list(list: unknown[]) { this.list$.next(list); }
  private list$ = new BehaviorSubject([]);

  @Input()
  set chunkSize(chunkSize: NumberInput) { this.chunkSize$.next(coerceNumberProperty(chunkSize, 1)); }
  private chunkSize$ = new BehaviorSubject(1);

  chunks$ = combineLatest([this.list$, this.chunkSize$]).pipe(
    map(([list, chunkSize]) => Array(Math.ceil(list.length / chunkSize))
      .fill(null)
      .map((_, index) => (chunk => [...chunk, ...Array(chunkSize - chunk.length)])(
        list.slice(index * chunkSize, (index + 1) * chunkSize)
      ))
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
}
