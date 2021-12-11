import { Component, Input, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Picker from 'vanilla-picker';

interface PickerSettings {
  parent: HTMLElement
}

interface PickerSelf {
  settings: PickerSettings
}

interface Color {
  rgba: number[];
  hsla: number[];
  rgbString: string;
  rgbaString: string;
  hslString: string;
  hslaString: string;
  hex: string;
}

@Component({
  selector: 'app-colour-input',
  templateUrl: './colour-input.component.html',
  styleUrls: ['./colour-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ColourInputComponent,
    },
  ],
})
export default class ColourInputComponent implements ControlValueAccessor, AfterViewInit {
  onChange: (colour: string) => void = () => { };

  onTouched = () => { };

  touched = false;

  disabled = false;

  @Input() colour = '#000000';

  @Input() aId = 'colourInput' + Math.round(Math.random() * 100000);

  @Input() label = '';

  ngAfterViewInit() {
    const aElement = document.getElementById(this.aId) ?? undefined;
    const { setColour } = this;

    new Picker({
      popup: 'top',
      onChange(colour) {
        const self = <PickerSelf>(this);
        setColour(colour, self.settings.parent);
      },
      parent: aElement,
      color: this.colour,
    });
  }

  openPopup = (event: MouseEvent) => {
    if ((<HTMLElement>event.target).nodeName !== 'A') {
      return;
    }

    this.markAsTouched();
    event.preventDefault();
  };

  setColour = (colour: Color, input: HTMLElement) => {
    // eslint-disable-next-line no-param-reassign
    input.style.background = colour.rgbaString;
    this.colour = colour.hex;
    this.onChange(this.colour);
  };

  writeValue = (colour: string) => {
    this.colour = colour;
  };

  registerOnChange = (onChange: (colour: string) => void) => {
    this.onChange = onChange;
  };

  registerOnTouched = (onTouched: () => void) => {
    this.onTouched = onTouched;
  };

  markAsTouched = () => {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  };

  setDisabledState = (disabled: boolean) => {
    this.disabled = disabled;
  };
}
