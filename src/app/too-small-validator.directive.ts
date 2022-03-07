import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function tooSmallValidator(minVal: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value < minVal;

    if (forbidden) {
      control.setValue(minVal);
    }

    return null;
  };
}
