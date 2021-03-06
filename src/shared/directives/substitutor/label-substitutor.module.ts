import { NgModule } from '@angular/core';
import { LabelSubstitutorDirective } from './label-substitutor.directive';
import { FieldsUtils } from '../../services/fields/fields.utils';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  declarations: [
    LabelSubstitutorDirective
  ],
  exports: [
    LabelSubstitutorDirective
  ],
  providers: [
    FieldsUtils,
    CurrencyPipe,
  ]
})
export class LabelSubstitutorModule {}
