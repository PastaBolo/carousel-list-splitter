import { NgModule } from '@angular/core';

import { ListSplitterDirective } from './list-splitter.directive';

@NgModule({
  declarations: [ListSplitterDirective],
  exports: [ListSplitterDirective]
})
export class ListSplitterModule { }
