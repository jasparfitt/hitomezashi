import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tooLargeValidator } from '../too-large-validator.directive';
import { tooSmallValidator } from '../too-small-validator.directive';

export interface SquareOptions {
  size: number,
  xOn: number,
  xOff: number,
  xProb: number,
  yOn: number,
  yOff: number,
  yProb: number,
  colourBool: boolean,
  colour1: string,
  colour2: string,
}

@Component({
  selector: 'app-square-form',
  templateUrl: './square-form.component.html',
  styleUrls: ['./square-form.component.scss'],
})
export class SquareFormComponent {
  @Output() draw = new EventEmitter<SquareOptions>();

  optionsForm = new FormGroup({
    xOn: new FormControl(1, [tooSmallValidator(0)]),
    xOff: new FormControl(0, [tooSmallValidator(0)]),
    xProb: new FormControl(0, [tooSmallValidator(0), tooLargeValidator(1)]),
    yOn: new FormControl(1, [tooSmallValidator(0)]),
    yOff: new FormControl(0, [tooSmallValidator(0)]),
    yProb: new FormControl(0, [tooSmallValidator(0), tooLargeValidator(1)]),
    colourBool: new FormControl(false),
    colour1: new FormControl('#ff0000'),
    colour2: new FormControl('#0000ff'),
    size: new FormControl(100, [tooSmallValidator(2), tooLargeValidator(200)]),
  });

  onSubmit() {
    this.draw.emit(this.optionsForm.value);
  }
}
