import { Directive, Input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

const DEFAULT_ITEM_SIZE = 1;
const DEFAULT_CHUNK_SIZE = 1;

type Chunk = { start: number, end: number, size: number, item?: unknown }[];

@Directive({
  selector: '[listSplitter]',
  exportAs: 'listSplitter'
})
export class ListSplitterDirective {
  @Input('listSplitter')
  set list(list: unknown[]) { this.list$.next(list); }
  private list$ = new BehaviorSubject([]);

  @Input()
  set chunkSize(chunkSize: NumberInput) { this.chunkSize$.next(coerceNumberProperty(chunkSize, DEFAULT_CHUNK_SIZE)); }
  private chunkSize$ = new BehaviorSubject(DEFAULT_CHUNK_SIZE);

  @Input()
  set fillWithEmpty(fillWithEmpty: BooleanInput) { this.fillWithEmpty$.next(coerceBooleanProperty(fillWithEmpty)); }
  private fillWithEmpty$ = new BehaviorSubject(false);

  @Input() itemSizeStrategy = (item: unknown) => DEFAULT_ITEM_SIZE;

  chunks$ = combineLatest([this.list$, this.chunkSize$, this.fillWithEmpty$]).pipe(
    map(([list, chunkSize, fillWithEmpty]) => {
      const chunks: Chunk[] = [];

      let size = 0;
      let chunk: Chunk = [];

      for (const item of list) {
        const itemSize = this.itemSizeStrategy(item) || DEFAULT_ITEM_SIZE;

        if (!chunk.length || size + itemSize <= chunkSize) {
          chunk.push({ start: size, end: Math.min(size + itemSize, chunkSize), size: Math.min(itemSize, chunkSize), item });
          size += itemSize;
        } else {
          if (fillWithEmpty) { this.fillChunkWithEmpty(chunk, size, chunkSize); }
          chunks.push(chunk);
          size = itemSize;
          chunk = [{ start: 0, end: Math.min(itemSize, chunkSize), size: Math.min(itemSize, chunkSize), item }];
        }
      }
      if (fillWithEmpty) { this.fillChunkWithEmpty(chunk, size, chunkSize); }
      chunks.push(chunk);

      return chunks;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  private fillChunkWithEmpty(chunk: Chunk, currentChunkSize: number, chunkSize: number) {
    chunk.push(...(
      currentChunkSize < chunkSize
        ? Array(chunkSize - currentChunkSize).fill(null)
          .map((_, i) => ({ start: currentChunkSize + i, end: currentChunkSize + i + 1, size: 1 }))
        : []
    ))
  }
}
