import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tooLargeValidator } from '../too-large-validator.directive';
import { tooSmallValidator } from '../too-small-validator.directive';

export interface IsometricOptions {
  size: number,
  xOn: number,
  xOff: number,
  xProb: number,
  yOn: number,
  yOff: number,
  yProb: number,
  zOn: number,
  zOff: number,
  zProb: number,
  colourBool: boolean,
  colour1: string,
  colour2: string,
  colour3: string,
  colour4: string,
}

@Component({
  selector: 'app-isometric-form',
  templateUrl: './isometric-form.component.html',
  styleUrls: ['./isometric-form.component.scss'],
})
export class IsometricFormComponent {
  @Output() draw = new EventEmitter<IsometricOptions>();

  optionsForm = new FormGroup({
    xOn: new FormControl(1, [tooSmallValidator(0)]),
    xOff: new FormControl(0, [tooSmallValidator(0)]),
    xProb: new FormControl(0, [tooSmallValidator(0), tooLargeValidator(1)]),
    yOn: new FormControl(1, [tooSmallValidator(0)]),
    yOff: new FormControl(0, [tooSmallValidator(0)]),
    yProb: new FormControl(0, [tooSmallValidator(0), tooLargeValidator(1)]),
    zOn: new FormControl(1, [tooSmallValidator(0)]),
    zOff: new FormControl(0, [tooSmallValidator(0)]),
    zProb: new FormControl(0, [tooSmallValidator(0), tooLargeValidator(1)]),
    colourBool: new FormControl(false),
    colour1: new FormControl('#ff0000'),
    colour2: new FormControl('#0000ff'),
    colour3: new FormControl('#00ff00'),
    colour4: new FormControl('#ffff00'),
    size: new FormControl(50, [tooLargeValidator(100), tooSmallValidator(2)]),
  });

  onSubmit() {
    this.draw.emit(this.optionsForm.value);
  }
}
