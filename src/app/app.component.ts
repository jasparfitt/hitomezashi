import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
interface SquareOptions {
  size: number,
  xOn: number,
  xOff: number,
  yOn: number,
  yOff: number,
  probX: number,
  probY: number,
  colourBool: boolean,
  colour1: string,
  colour2: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export default class AppComponent {
  title = 'hitomezashi';

  colour1 = '#000000';

  colour2 = '#ffffff';

  mode = new FormControl('square');

  squareOptionsForm = new FormGroup({
    xOn: new FormControl(1),
    xOff: new FormControl(1),
    yOn: new FormControl(1),
    yOff: new FormControl(1),
    probX: new FormControl(0),
    probY: new FormControl(0),
    colourBool: new FormControl(false),
    colour1: new FormControl('#ffffff'),
    colour2: new FormControl('#000000'),
    size: new FormControl(100),
  });

  isoOptionsForm = new FormGroup({});

  static randBool = (p: number) => Math.random() > p;

  static getPoint = (i: number, n: number) => {
    const total = 1000;
    const unit = total / n;

    return (i * unit) + unit * 0.5;
  };

  static getIsoPoint = (xNum: number, yNum: number, n: number) => {
    const total = 1000;
    const unit = total / n;

    const xP = (xNum * unit) + (yNum * unit * 0.5) + (unit * 0.5);
    const yP = (unit * yNum * Math.sqrt(3) * 0.5) + (unit * 0.5);

    return { xP, yP };
  };

  static drawIsoLine = (
    ctx: CanvasRenderingContext2D,
    xIsoS: number,
    yIsoS: number,
    xIsoF: number,
    yIsoF: number,
    t: number,
  ) => {
    ctx.beginPath();
    const { xP: xs, yP: ys } = AppComponent.getIsoPoint(xIsoS, yIsoS, t);
    const { xP: xf, yP: yf } = AppComponent.getIsoPoint(xIsoF, yIsoF, t);
    ctx.moveTo(xs, ys);
    ctx.lineTo(xf, yf);
    ctx.closePath();
    ctx.stroke();
  };

  static drawLine = (
    ctx: CanvasRenderingContext2D,
    xs: number,
    ys: number,
    xf: number,
    yf: number,
    x: number,
    y: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(AppComponent.getPoint(xs, x), AppComponent.getPoint(ys, y));
    ctx.lineTo(AppComponent.getPoint(xf, x), AppComponent.getPoint(yf, y));
    ctx.closePath();
    ctx.stroke();
  };

  static isIsoPointOnGrid = (x: number, y: number, n: number) => x >= 0 && y >= 0 && (x + y) < n;

  static hitomezashiTriangle = () => {
    const n = 13;
    const probx = 0.5;
    const proby = 1;
    const probz = 1;
    const xValues = [];
    const yValues = [];
    const zValues = [];

    for (let i = 0; i < n; i += 1) {
      xValues.push(AppComponent.randBool(probx));
    }

    for (let i = 0; i < n; i += 1) {
      yValues.push(AppComponent.randBool(proby));
    }

    for (let i = 0; i < n; i += 1) {
      zValues.push(AppComponent.randBool(probz));
    }

    const ctx = AppComponent.getCanvas();
    ctx.fillStyle = 'green';

    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        if ((i + j) < n) {
          // const circle = new Path2D();
          // const {xP: x, yP: y} = getIsoPoint(i, j, n);
          // circle.arc(x, y, 1, 0, 2 * Math.PI);
          // ctx.fill(circle);
        }
      }
    }

    // opposing
    xValues.forEach((val, i) => {
      for (let j = 0; j < n; j += 2) {
        let yVal = j;

        if (!val) {
          yVal += 1;
        }

        const xStart = i - yVal;
        const xEnd = xStart - 1;
        const yEnd = yVal + 1;

        if (
          AppComponent.isIsoPointOnGrid(xStart, yVal, n)
          && AppComponent.isIsoPointOnGrid(xEnd, yEnd, n)
        ) {
          AppComponent.drawIsoLine(ctx, xStart, yVal, xEnd, yEnd, n);
        }
      }
    });

    // compliment
    // xValues.forEach((val, i) => {
    //     for (let j = 0; j < n; j += 2) {
    //         let xVal = j;

    //         if (!val) {
    //             xVal++;
    //         }

    //         const yStart = i - xVal;
    //         const xStart = xVal;
    //         const xEnd = xVal + 1;
    //         const yEnd = yStart - 1;
    //         if (isIsoPointOnGrid(xStart, yStart, n) && isIsoPointOnGrid(xEnd, yEnd, n)) {
    //             drawIsoLine(ctx, xStart, yStart, xEnd, yEnd, n);
    //         }
    //     }
    // });

    yValues.forEach((val, i) => {
      for (let j = 0; j < n; j += 2) {
        let xVal = j;

        if (!val) {
          xVal -= 1;
        }

        const xStart = xVal;
        const xEnd = xVal + 1;
        const yEnd = i;
        if (
          AppComponent.isIsoPointOnGrid(xStart, i, n)
          && AppComponent.isIsoPointOnGrid(xEnd, yEnd, n)
        ) {
          AppComponent.drawIsoLine(ctx, xStart, i, xEnd, yEnd, n);
        }
      }
    });

    zValues.forEach((val, i) => {
      const x = n - i - 1;
      let y = i;

      if (!val) {
        y -= 1;
      }

      for (let j = 0; j < n; j += 2) {
        const xStart = x;
        const yStart = y - j;
        const xEnd = x;
        const yEnd = yStart - 1;

        if (
          AppComponent.isIsoPointOnGrid(xStart, yStart, n)
          && AppComponent.isIsoPointOnGrid(xEnd, yEnd, n)
        ) {
          AppComponent.drawIsoLine(ctx, xStart, yStart, xEnd, yEnd, n);
        }
      }
    });
  };

  static drawSquare = (
    ctx: CanvasRenderingContext2D,
    xs: number,
    ys: number,
    x: number,
    y: number,
    colour: string,
  ) => {
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.moveTo(AppComponent.getPoint(xs + 0.0, x), AppComponent.getPoint(ys + 0.0, y));
    ctx.lineTo(AppComponent.getPoint(xs + 1.0, x), AppComponent.getPoint(ys + 0.0, y));
    ctx.lineTo(AppComponent.getPoint(xs + 1.0, x), AppComponent.getPoint(ys + 1.0, y));
    ctx.lineTo(AppComponent.getPoint(xs + 0.0, x), AppComponent.getPoint(ys + 1.0, y));
    ctx.lineTo(AppComponent.getPoint(xs + 0.0, x), AppComponent.getPoint(ys + 0.0, y));
    ctx.closePath();
    ctx.fill();
  };

  static getCanvas = (): CanvasRenderingContext2D => {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('hit-canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw Error('no context');
    }

    return ctx;
  };

  static getRandArray = (length: number, prob: number): Array<boolean> => {
    const values = [];

    for (let i = 0; i < length; i += 1) {
      values.push(AppComponent.randBool(prob));
    }

    return values;
  };

  static getOnOffArray = (
    length: number,
    on: number,
    off: number,
    prob: number,
  ): Array<boolean> => {
    const values = [];

    for (let i = 0; i < length; i += 1) {
      let val = 1;

      for (let j = 0; j < off; j += 1) {
        val *= (i + j) % (on + off);
      }

      let boolVal = !val;

      if (!AppComponent.randBool(prob)) {
        boolVal = !boolVal;
      }

      values.push(boolVal);
    }

    return values;
  };

  static hitomezashiSquare = (options: SquareOptions) => {
    const x = options.size;
    const y = options.size;
    const xValues = AppComponent.getOnOffArray(x, options.xOn, options.xOff, options.probX);
    const yValues = AppComponent.getOnOffArray(y, options.yOn, options.yOff, options.probY);

    const ctx = AppComponent.getCanvas();

    ctx.fillStyle = 'green';

    for (let i = 0; i < x; i += 1) {
      for (let j = 0; j < y; j += 1) {
        const circle = new Path2D();
        circle.arc(AppComponent.getPoint(i, x), AppComponent.getPoint(j, y), 1, 0, 2 * Math.PI);
        ctx.fill(circle);
      }
    }

    xValues.forEach((val, i) => {
      for (let j = 0; j < y - 1; j += 2) {
        let yVal = j;

        if (!val) {
          yVal += 1;
        }

        if (yVal < y - 1) {
          AppComponent.drawLine(ctx, i, yVal, i, yVal + 1, x, y);
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
          AppComponent.drawLine(ctx, xVal, i, xVal + 1, i, x, y);
        }
      }
    });

    let colour = true;

    const firstRow = [];
    for (let i = 0; i < x - 1; i += 1) {
      if (xValues[i] && i !== 0) {
        colour = !colour;
      }

      firstRow.push(colour);
    }

    if (options.colourBool) {
      for (let i = 0; i < x - 1; i += 1) {
        colour = firstRow[i];
        for (let j = 0; j < y - 1; j += 1) {
          const xTrue = !(i % 2);

          if (xTrue === yValues[j] && j !== 0) {
            colour = !colour;
          }

          AppComponent.drawSquare(ctx, i, j, x, y, colour ? options.colour1 : options.colour2);
        }
      }
    }
  };

  draw = () => {
    const ctx = AppComponent.getCanvas();
    ctx.clearRect(0, 0, 1000, 1000);
    console.log(this.mode.value);

    const square = this.mode.value === 'square';
    if (square) {
      AppComponent.hitomezashiSquare(this.squareOptionsForm.value);
    } else {
      AppComponent.hitomezashiTriangle();
    }
  };
}
