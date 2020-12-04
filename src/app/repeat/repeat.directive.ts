import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[repeat]'
})
export class RepeatDirective {
  @Input() set repeat(repeat: number) {
    this.vcr.clear();
    for (let i = 0; i < repeat; i++) {
      this.vcr.createEmbeddedView(this.tmpl, { index: i });
    }
  }

  constructor(private vcr: ViewContainerRef, private tmpl: TemplateRef<any>) { }
}
