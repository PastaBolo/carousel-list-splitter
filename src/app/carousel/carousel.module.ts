import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselComponent } from './carousel.component';
import { CarouselItemDirective } from './carousel-item.directive';
import { MaxPipe } from '../max.pipe'; // TODO

@NgModule({
  declarations: [CarouselComponent, CarouselItemDirective, MaxPipe],
  imports: [CommonModule],
  exports: [CarouselComponent, CarouselItemDirective]
})
export class CarouselModule { }
