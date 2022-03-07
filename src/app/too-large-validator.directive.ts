import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function tooLargeValidator(maxVal: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value > maxVal;
    if (forbidden) {
      control.setValue(maxVal);
    }
    return null;
  };
}
