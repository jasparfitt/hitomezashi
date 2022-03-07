import { Injectable } from '@angular/core';
import { Point } from './point';
import { Shape } from './shape';

@Injectable({
  providedIn: 'root',
})
export class SquareService {
  getPoint = (x: number, xSize: number, y: number, ySize: number) => {
    return new Point(this.scaleNumber(x, xSize), this.scaleNumber(y, ySize));
  };

  scaleNumber(n: number, size: number) {
    const total = 1000;
    const unit = total / size;

    return (n * unit) + unit * 0.5;
  }

  getLines(xValues: Array<boolean>, yValues: Array<boolean>, xSize: number, ySize: number) {
    const lines: Array<Shape> = [];

    xValues.forEach((val, i) => {
      for (let j = 0; j < ySize - 1; j += 2) {
        let yVal = j;

        if (!val) {
          yVal += 1;
        }

        if (yVal < ySize - 1) {
          lines.push(new Shape('#000', [
            this.getPoint(i, xSize, yVal, ySize),
            this.getPoint(i, xSize, yVal + 1, ySize),
          ]));
        }
      }
    });

    yValues.forEach((val, i) => {
      for (let j = 0; j < xSize - 1; j += 2) {
        let xVal = j;

        if (!val) {
          xVal += 1;
        }

        if (xVal < ySize - 1) {
          lines.push(new Shape('#000', [
            this.getPoint(xVal, xSize, i, ySize),
            this.getPoint(xVal + 1, xSize, i, ySize),
          ]));
        }
      }
    });

    return lines;
  }

  getShapes(xValues: Array<boolean>, yValues: Array<boolean>, xSize: number, ySize: number, colours: Array<string>) {
    const shapes = [];
    let colour = true;

    let lastRowStartColour = colour;

    for (let i = 0; i < xSize - 1; i += 1) {
      colour = lastRowStartColour;

      if (xValues[i]) {
        colour = !lastRowStartColour;
      }

      lastRowStartColour = colour;

      for (let j = 0; j < ySize - 1; j += 1) {
        const xTrue = !(i % 2);

        if (xTrue === yValues[j] && j !== 0) {
          colour = !colour;
        }

        const colourString = colour ? colours[0] : colours[1];
        shapes.push(new Shape(colourString, [
          this.getPoint(i, xSize, j, ySize),
          this.getPoint(i + 1, xSize, j, ySize),
          this.getPoint(i + 1, xSize, j + 1, ySize),
          this.getPoint(i, xSize, j + 1, ySize),
          this.getPoint(i, xSize, j, ySize),
        ]));
      }
    }

    return shapes;
  }

  getGridPoints(xSize: number, ySize: number) {
    const gridPoints = [];

    for (let i = 0; i < xSize; i += 1) {
      for (let j = 0; j < ySize; j += 1) {
        gridPoints.push(new Shape('#0f0', [
          this.getPoint(i, xSize, j, ySize),
        ]));
      }
    }

    return gridPoints;
  }
}
