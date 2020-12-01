import { AfterContentInit, ContentChild, ContentChildren, Directive, Input, QueryList, TemplateRef, ViewContainerRef } from '@angular/core';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

import { ListItemDirective } from './list-item.directive';
import { ListChunkContainerDirective } from './list-chunk-container.directive';

@Directive({
  selector: '[listSplitter]'
})
export class ListSplitterDirective implements AfterContentInit {
  @ContentChild(ListChunkContainerDirective, { read: TemplateRef }) containerTmpl: TemplateRef<any>;
  @ContentChildren(ListItemDirective, { read: TemplateRef }) items: QueryList<TemplateRef<any>>;

  @Input()
  set chunkSize(chunkSize: NumberInput) {
    this._chunkSize = coerceNumberProperty(chunkSize, 1);
    if (this.items) { this.refreshView(); }
  }
  get chunkSize() { return this._chunkSize as number; }
  private _chunkSize: number;

  private get splittedList() {
    const chunkSize = this.chunkSize as number;
    return Array(Math.ceil(this.items.toArray().length / chunkSize))
      .fill(null)
      .map((_, index) => (chunk => [...chunk, ...Array(chunkSize - chunk.length)])(
        this.items.toArray().slice(index * chunkSize, (index + 1) * chunkSize)
      ));
  }

  constructor(private vcr: ViewContainerRef) { }

  ngAfterContentInit() {
    this.refreshView();
    console.log(this.splittedList)
  }

  private refreshView() {
    this.vcr.clear();
    this.splittedList.forEach(
      itemsTmpl => this.vcr.createEmbeddedView(this.containerTmpl, { $implicit: itemsTmpl })
    );
  }
}
