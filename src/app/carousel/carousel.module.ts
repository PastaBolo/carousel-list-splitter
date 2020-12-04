import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselComponent } from './carousel.component';
import { CarouselItemDirective } from './carousel-item.directive';
import { RepeatModule } from '../repeat/repeat.module';

@NgModule({
  declarations: [CarouselComponent, CarouselItemDirective],
  imports: [CommonModule, RepeatModule],
  exports: [CarouselComponent, CarouselItemDirective]
})
export class CarouselModule { }
