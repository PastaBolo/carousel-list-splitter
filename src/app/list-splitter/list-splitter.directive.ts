import { Directive, Input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

type Chunk = { start: number, end: number, size: number, item?: unknown }[];

const defaultItemSizeStrategy = (item: unknown) => 1;

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

  @Input()
  set fillWithEmpty(fillWithEmpty: BooleanInput) { this.fillWithEmpty$.next(coerceBooleanProperty(fillWithEmpty)); }
  private fillWithEmpty$ = new BehaviorSubject(false);

  @Input() itemSizeStrategy = defaultItemSizeStrategy;

  chunks$: Observable<Chunk[]> = combineLatest([this.list$, this.chunkSize$, this.fillWithEmpty$]).pipe(
    map(([list, chunkSize, fillWithEmpty]) => {
      const chunks = [];
      let chunk = { size: 0, items: [] };

      for (const item of list) {
        const itemSize = this.itemSizeStrategy(item) || 1;

        if (!chunk.items.length || chunk.size + itemSize <= chunkSize) {
          chunk = {
            size: chunk.size + itemSize,
            items: [
              ...chunk.items,
              { start: chunk.size, end: Math.min(chunk.size + itemSize, chunkSize), size: Math.min(itemSize, chunkSize), item }
            ]
          };
        } else {
          if (fillWithEmpty) { this.fillChunkWithEmpty(chunk, chunkSize); }
          chunks.push(chunk);
          chunk = {
            size: itemSize,
            items: [{ start: 0, end: Math.min(itemSize, chunkSize), size: Math.min(itemSize, chunkSize), item }]
          };
        }
      }
      if (fillWithEmpty) { this.fillChunkWithEmpty(chunk, chunkSize); }
      chunks.push(chunk);

      return chunks.map(chunk => chunk.items);
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  private fillChunkWithEmpty(
    chunk: { size: number, items: Chunk },
    chunkSize: number
  ) {
    chunk.items = [
      ...chunk.items,
      ... (chunk.size < chunkSize
        ? Array(chunkSize - chunk.size).fill(null)
          .map((_, i) => ({ start: chunk.size + i, end: chunk.size + i + 1, size: 1 }))
        : [])
    ];
  }
}
