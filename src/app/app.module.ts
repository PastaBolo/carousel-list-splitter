import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from './app.component';
import { ListSplitterDirective } from './list-splitter.directive';
import { ListItemDirective } from './list-item.directive';
import { ListChunkContainerDirective } from './list-chunk-container.directive';
import { CarouselItemDirective } from './carousel-item.directive';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    ListSplitterDirective,
    ListItemDirective,
    ListChunkContainerDirective,
    CarouselItemDirective,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
