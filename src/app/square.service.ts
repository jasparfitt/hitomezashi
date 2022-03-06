import { Injectable } from '@angular/core';
import { Point } from './point';
import { Shape } from './shape';

@Injectable({
  providedIn: 'root',
})
export class SquareService {
  getPoint = (x: number, xScale: number, y: number, yScale: number) => {
    return new Point(this.scaleNumber(x, xScale), this.scaleNumber(y, yScale));
  };

  scaleNumber(n: number, scale: number) {
    const total = 1000;
    const unit = total / scale;

    return (n * unit) + unit * 0.5;
  }

  getLines(xValues: Array<boolean>, yValues: Array<boolean>, x: number, y: number) {
    const lines: Array<Shape> = [];

    xValues.forEach((val, i) => {
      for (let j = 0; j < y - 1; j += 2) {
        let yVal = j;

        if (!val) {
          yVal += 1;
        }

        if (yVal < y - 1) {
          lines.push(new Shape('#000', [
            this.getPoint(i, x, yVal, y),
            this.getPoint(i, x, yVal + 1, y),
          ]));
        }
      }
    });

    yValues.forEach((val, i) => {
      for (let j = 0; j < x - 1; j += 2) {
        let xVal = j;

        if (!val) {
          xVal += 1;
        }

        if (xVal < y - 1) {
          lines.push(new Shape('#000', [
            this.getPoint(xVal, x, i, y),
            this.getPoint(xVal + 1, x, i, y),
          ]));
        }
      }
    });

    return lines;
  }

  getShapes(xValues: Array<boolean>, yValues: Array<boolean>, x: number, y: number, colours: Array<string>) {
    const shapes: Array<Shape> = [];
    let colour = true;

    let lastRowStartColour = colour;

    for (let i = 0; i < x - 1; i += 1) {
      colour = lastRowStartColour;

      if (xValues[i]) {
        colour = !lastRowStartColour;
      }

      lastRowStartColour = colour;

      for (let j = 0; j < y - 1; j += 1) {
        const xTrue = !(i % 2);

        if (xTrue === yValues[j] && j !== 0) {
          colour = !colour;
        }

        const colourString = colour ? colours[0] : colours[1];
        shapes.push(new Shape(colourString, [
          this.getPoint(i, x, j, y),
          this.getPoint(i + 1, x, j, y),
          this.getPoint(i + 1, x, j + 1, y),
          this.getPoint(i, x, j + 1, y),
          this.getPoint(i, x, j, y),
        ]));
      }
    }

    return shapes;
  }

  getGridPoints() {

  }
}
