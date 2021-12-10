import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hitomezashi';

  onOffForm = new FormGroup({
    xOn: new FormControl(1),
    xOff: new FormControl(1),
    yOn: new FormControl(1),
    yOff: new FormControl(1),
  })

  randBool = (p: number) => {
    return Math.random() > p;
  };

  getPoint = (i: number, n: number) => {
    const total = 1000;
    const unit = total / n;

    return (i * unit) + unit * 0.5;
  };

  getIsoPoint = (xNum: number, yNum: number, n: number) => {
    const total = 1000;
    const unit = total / n;

    let xP = (xNum * unit) + (yNum * unit * 0.5) + (unit * 0.5);
    let yP = (unit * yNum * Math.sqrt(3) * 0.5) + (unit * 0.5);

    return { xP, yP };
  };

  drawIsoLine = (ctx: any, xIsoS: number, yIsoS: number, xIsoF: number, yIsoF: number, t: number) => {
    ctx.beginPath();
    const { xP: xs, yP: ys } = this.getIsoPoint(xIsoS, yIsoS, t);
    const { xP: xf, yP: yf } = this.getIsoPoint(xIsoF, yIsoF, t);
    ctx.moveTo(xs, ys);
    ctx.lineTo(xf, yf);
    ctx.closePath();
    ctx.stroke();
  };

  drawLine = (ctx: any, xs: number, ys: number, xf: number, yf: number, x: number, y: number) => {
    ctx.beginPath();
    ctx.moveTo(this.getPoint(xs, x), this.getPoint(ys, y));
    ctx.lineTo(this.getPoint(xf, x), this.getPoint(yf, y));
    ctx.closePath();
    ctx.stroke();
  };

  isIsoPointOnGrid = (x: number, y: number, n: number) => {
    return x >= 0 && y >= 0 && (x + y) < n;
  };

  hitomezashiTriangle = () => {
    const n = 13;
    const probx = 0.5;
    const proby = 1;
    const probz = 1;
    const xValues = [];
    const yValues = [];
    const zValues = [];

    for (let i = 0; i < n; i++) {
      xValues.push(this.randBool(probx));
    }

    for (let i = 0; i < n; i++) {
      yValues.push(this.randBool(proby));
    }

    for (let i = 0; i < n; i++) {
      zValues.push(this.randBool(probz));
    }

    const ctx = this.getCanvas();
    ctx.fillStyle = 'green';

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
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
          yVal++;
        }

        const xStart = i - yVal;
        const xEnd = xStart - 1;
        const yEnd = yVal + 1;

        if (this.isIsoPointOnGrid(xStart, yVal, n) && this.isIsoPointOnGrid(xEnd, yEnd, n)) {
          this.drawIsoLine(ctx, xStart, yVal, xEnd, yEnd, n);
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
          xVal--;
        }

        const xStart = xVal;
        const xEnd = xVal + 1;
        const yEnd = i;
        if (this.isIsoPointOnGrid(xStart, i, n) && this.isIsoPointOnGrid(xEnd, yEnd, n)) {
          this.drawIsoLine(ctx, xStart, i, xEnd, yEnd, n);
        }
      }
    });

    zValues.forEach((val, i) => {
      let x = n - i - 1;
      let y = i;

      if (!val) {
        y--;
      }

      for (let j = 0; j < n; j += 2) {
        const xStart = x;
        const yStart = y - j;
        const xEnd = x;
        const yEnd = yStart - 1;

        if (this.isIsoPointOnGrid(xStart, yStart, n) && this.isIsoPointOnGrid(xEnd, yEnd, n)) {
          this.drawIsoLine(ctx, xStart, yStart, xEnd, yEnd, n);
        }
      }
    });

  };

  drawSquare = (ctx: any, xs: number, ys: number, x: number, y: number, colour: string) => {
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.moveTo(this.getPoint(xs + 0.0, x), this.getPoint(ys + 0.0, y));
    ctx.lineTo(this.getPoint(xs + 1.0, x), this.getPoint(ys + 0.0, y));
    ctx.lineTo(this.getPoint(xs + 1.0, x), this.getPoint(ys + 1.0, y));
    ctx.lineTo(this.getPoint(xs + 0.0, x), this.getPoint(ys + 1.0, y));
    ctx.lineTo(this.getPoint(xs + 0.0, x), this.getPoint(ys + 0.0, y));
    ctx.closePath();
    ctx.fill();
  };

  getCanvas = (): CanvasRenderingContext2D => {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('hit-canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw Error('no context');
    }

    return ctx;
  }

  getRandArray = (length: number, prob: number): Array<boolean> => {
    const values = [];

    for (let i = 0; i < length; i++) {
      values.push(this.randBool(prob));
    }

    return values;
  }

  getOnOffArray = (length: number, on: number, off: number, prob: number): Array<boolean> => {
    const values = [];

    for (let i = 0; i < length; i++) {
      let val = 1;

      for (let j = 0; j < off; j++) {
        val *= (i + j) % (on + off);
      }

      values.push(!!val);
    }

    return values;
  }

  hitomezashiSquare = (onOff: any) => {
    console.log(onOff);
    const x = 100;
    const y = 100;
    const probx = 0.5;
    const proby = 0;
    const xValues = this.getOnOffArray(x, onOff.xOn, onOff.xOff, probx);
    const yValues = this.getOnOffArray(y, onOff.yOn, onOff.yOff, proby);

    const ctx = this.getCanvas();

    ctx.fillStyle = 'green';

    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        var circle = new Path2D();
        circle.arc(this.getPoint(i, x), this.getPoint(j, y), 1, 0, 2 * Math.PI);
        ctx.fill(circle);
      }
    }

    xValues.forEach((val, i) => {
      for (let j = 0; j < y - 1; j += 2) {
        let yVal = j;

        if (!val) {
          yVal++;
        }

        if (yVal < y - 1) {
          this.drawLine(ctx, i, yVal, i, yVal + 1, x, y);
        }
      }
    });

    yValues.forEach((val, i) => {
      for (let j = 0; j < x - 1; j += 2) {
        let xVal = j;

        if (!val) {
          xVal++;
        }

        if (xVal < y - 1) {
          this.drawLine(ctx, xVal, i, xVal + 1, i, x, y);
        }
      }
    });

    let colour = true;

    const firstRow = [];
    for (let i = 0; i < x - 1; i++) {
      if (xValues[i] && i !== 0) {
        colour = !colour;
      }

      firstRow.push(colour);
    }

    for (let i = 0; i < x - 1; i++) {
      colour = firstRow[i];
      for (let j = 0; j < y - 1; j++) {
        const xTrue = !(i % 2);

        if (xTrue == yValues[j] && j !== 0) {
          colour = !colour;
        }

        this.drawSquare(ctx, i, j, x, y, colour ? '#a8b7ab' : '#E2C391');
      }
    }
  };

  draw = () => {
    let square = true;
    // square = false;

    if (square) {
      this.hitomezashiSquare(this.onOffForm.value);
    } else {
      this.hitomezashiTriangle();
    }
  }
}
