import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
    xOn: new FormControl(1),
    xOff: new FormControl(0),
    xProb: new FormControl(0),
    yOn: new FormControl(1),
    yOff: new FormControl(0),
    yProb: new FormControl(0),
    zOn: new FormControl(1),
    zOff: new FormControl(0),
    zProb: new FormControl(0),
    colourBool: new FormControl(false),
    colour1: new FormControl('#ff0000'),
    colour2: new FormControl('#0000ff'),
    colour3: new FormControl('#00ff00'),
    colour4: new FormControl('#ffff00'),
    size: new FormControl(50),
  });

  onSubmit() {
    this.draw.emit(this.optionsForm.value);
  }
}
