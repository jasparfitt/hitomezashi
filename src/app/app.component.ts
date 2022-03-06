import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IsometricOptions } from './isometric-form/isometric-form.component';
import { SquareOptions } from './square-form/square-form.component';
import { SquareService } from './square.service';
import { Shape } from './shape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export default class AppComponent {
  constructor(
    private squareService: SquareService,
  ) { }

  title = 'hitomezashi';

  mode = new FormControl('square');

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

  static drawTriangle = (
    ctx: CanvasRenderingContext2D,
    xs: number,
    ys: number,
    n: number,
    colour: string,
  ) => {
    ctx.beginPath();
    ctx.fillStyle = colour;
    let xDiff, yDiff;

    if (ys % 2) {
      xDiff = 1.0;
      yDiff = -1.0;
    } else {
      xDiff = 0.0;
      yDiff = 1.0;
    }

    const { xP: x1, yP: y1 } = AppComponent.getIsoPoint(xs + 0.0, Math.ceil(ys / 2) + 0.0, n);
    const { xP: x2, yP: y2 } = AppComponent.getIsoPoint(xs + 1.0, Math.ceil(ys / 2) + 0.0, n);
    const { xP: x3, yP: y3 } = AppComponent.getIsoPoint(xs + xDiff, Math.ceil(ys / 2) + yDiff, n);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.fill();
  };

  static hitomezashiIsometric = (options: IsometricOptions) => {
    const n = options.size;
    const probx = options.xProb;
    const proby = options.yProb;
    const probz = options.zProb;
    const xValues = AppComponent.getOnOffArray(n, options.xOn, options.xOff, options.xProb);
    const yValues = AppComponent.getOnOffArray(n, options.yOn, options.yOff, options.yProb);
    const zValues = AppComponent.getOnOffArray(n, options.zOn, options.zOff, options.zProb);

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
          const circle = new Path2D();
          const { xP: x, yP: y } = AppComponent.getIsoPoint(i, j, n);
          circle.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fill(circle);
        }
      }
    }

    ctx.strokeStyle = 'black';
    xValues.forEach((val, i) => {
      for (let j = 0; j < n; j += 2) {
        let xVal = j;

        if (!val) {
          xVal++;
        }

        const xStart = i - xVal;
        const yStart = xVal;
        const xEnd = xStart + 1;
        const yEnd = yStart - 1;
        if (AppComponent.isIsoPointOnGrid(xStart, yStart, n) && AppComponent.isIsoPointOnGrid(xEnd, yEnd, n)) {
          AppComponent.drawIsoLine(ctx, xStart, yStart, xEnd, yEnd, n);
        }
      }
    });

    yValues.forEach((val, i) => {
      for (let j = 0; j < n; j += 2) {
        let xVal = j - 1;

        if (!val) {
          xVal += 1;
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
      const x = i;
      let y = 0;

      if (val) {
        y = 1;
      }

      for (let j = 0; j < n; j += 2) {
        const xStart = x;
        const yStart = j + y;
        const xEnd = x;
        const yEnd = yStart + 1;

        if (
          AppComponent.isIsoPointOnGrid(xStart, yStart, n)
          && AppComponent.isIsoPointOnGrid(xEnd, yEnd, n)
        ) {
          AppComponent.drawIsoLine(ctx, xStart, yStart, xEnd, yEnd, n);
        }
      }
    });

    if (options.colourBool) {

      const isOnGrid = (x: number, y: number) => {
        const xSize = n - 1 - Math.ceil(y / 2);
        const ySize = (n * 2) - 3;

        return x >= 0 && y >= 0 && y < ySize && x < xSize;
      };

      const lineBetween = (x1: number, y1: number, x2: number, y2: number, yEven: boolean) => {
        const xDiff = x1 - x2;
        const yDiff = y1 - y2;
        const yDirDiffValue = yEven ? 1 : -1;

        let direction = 'z';

        if (yDiff === yDirDiffValue) {
          direction = 'y';
        } else if (xDiff === 0) {
          direction = 'x';
        }

        let pointX;
        let pointY;

        if (yEven) {
          if (direction === 'x') {
            pointX = x1 + 1;
            pointY = y1 / 2;
          } else {
            pointX = x1;
            pointY = y1 / 2;
          }
        } else {
          if (direction === 'y') {
            pointX = x1;
            pointY = Math.ceil(y1 / 2);
          } else {
            pointX = x1 + 1;
            pointY = Math.ceil(y1 / 2) - 1;
          }
        }

        let hasLine = false;
        let val;

        if (direction === 'x') {
          val = xValues[pointX + pointY];
          hasLine = !(pointY % 2);
        } else if (direction === 'y') {
          val = yValues[pointY];
          hasLine = !(pointX % 2);
        } else {
          val = zValues[pointX];
          hasLine = !(pointY % 2);
        }

        if (val) {
          hasLine = !hasLine;
        }

        return hasLine;
      };

      const checkNeighbours = (x: number, y: number, colour: number, grid: Array<Array<number>>) => {
        const yEven = !(y % 2);
        const nCoords = [
          { x, y: y - 1 },
          { x, y: y + 1 },
        ];
        const neighbours: Array<any> = [];
        const connections: Array<any> = [];

        if (yEven) {
          nCoords.push({ x: x - 1, y: y + 1 });
        } else {
          nCoords.push({ x: x + 1, y: y - 1 });
        }

        nCoords.forEach(coord => {
          if (isOnGrid(coord.x, coord.y) && !lineBetween(x, y, coord.x, coord.y, yEven) && !grid[coord.x][coord.y]) {
            neighbours.push({
              x: coord.x,
              y: coord.y,
            });
            grid[coord.x][coord.y] = colour;
          } else if (isOnGrid(coord.x, coord.y) && lineBetween(x, y, coord.x, coord.y, yEven) && grid[coord.x][coord.y]) {
            const pair = [colour, grid[coord.x][coord.y]];
            pair.sort((a, b) => Math.sign(a - b));
            connections.push(pair);
          }
        });

        return { neighbours, connections };
      };

      const colours: Array<Array<number>> = [];

      for (let i = 0; i < n - 1; i++) {
        colours.push([0]);
      }

      let shapeNumber = 1;

      const yLength = (n * 2) - 3;
      const connections: Array<any> = [];

      for (let j = 0; j < yLength; j++) {
        for (let i = 0; i < n - 1 - Math.ceil(j / 2); i++) {
          if (!colours[i][j]) {
            colours[i][j] = shapeNumber;

            let pointsToCheck = [{
              x: i,
              y: j,
            }];

            const num = shapeNumber;
            while (pointsToCheck.length !== 0) {
              let newPoints: Array<any> = [];

              pointsToCheck.forEach(point => {
                const t = checkNeighbours(point.x, point.y, num, colours);
                newPoints = newPoints.concat(t.neighbours);
                connections.push(t.connections);
              });

              pointsToCheck = newPoints;
            }

            shapeNumber++;
          }
        }
      }

      let connArray: Array<any> = [];
      connections.forEach(val => connArray = connArray.concat(val));

      const fourColours: Array<any> = [options.colour1, options.colour2, options.colour3, options.colour4, '#000000'];
      let someColours: Array<any> = [];
      const someTempColours: Array<any> = [];
      let runs: Array<number> = [];
      const checkColour = (i: number) => {
        runs[i] = (runs[i] ?? 0) + 1;
        if (runs[i] > 5000) {
          throw new Error('too many calls');
        }
        const neighbourNums = connArray
          .filter(connection => connection[0] === i || connection[1] === i)
          .map(connection => connection[0] === i ? connection[1] : connection[0]);

        const neighbourCols = neighbourNums.reduce((p, c) => {
          if (someTempColours[c] !== undefined && !p.includes(someTempColours[c])) {
            p.push(someTempColours[c]);
          }

          return p;
        }, []);

        const noColour = [0, 1, 2, 3].every(v => {
          if (!neighbourCols.includes(fourColours[v])) {
            someTempColours[i] = fourColours[v];

            return false;
          }

          return true;
        });

        if (noColour) {
          const colCount = neighbourNums.reduce((p, c) => {
            if (someTempColours[c] !== undefined) {
              const ind = fourColours.indexOf(someTempColours[c]);
              p[ind]++;
            }

            return p;
          }, [0, 0, 0, 0]);

          let colInd = colCount.indexOf(Math.min(...colCount));
          if (Math.random() > 0.9) {
            colInd = Math.floor(Math.random() * 4);
          }
          const chosenColour = fourColours[colInd];
          someTempColours[i] = chosenColour;
          const checkAgain: Array<number> = [];
          neighbourNums.forEach((num) => {
            if (someTempColours[num] !== undefined && someTempColours[num] === chosenColour) {
              someTempColours[num] = undefined;
              checkAgain.push(num);
            }
          });

          checkAgain.forEach((num) => {
            checkColour(num);
          });
        }
      };
      let attempts = 0;

      const doTheLoop = () => {
        runs = [];
        try {
          attempts++;
          for (let i = 0; i <= shapeNumber; i++) {
            checkColour(i);
          }
        } catch (e) {
          if (attempts < 20) {
            doTheLoop();
          }
        }
      };

      doTheLoop();

      someColours = someTempColours;

      colours.forEach((row, i) => {
        row.forEach((val, j) => {
          AppComponent.drawTriangle(ctx, i, j, n, someColours[val]);
        });
      });
    }
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

  drawLine(ctx: CanvasRenderingContext2D, line: Shape) {
    ctx.beginPath();
    ctx.strokeStyle = line.colour;
    ctx.moveTo(line.points[0].x, line.points[0].y);
    line.points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.stroke();
  }

  drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.beginPath();
    ctx.fillStyle = shape.colour;
    ctx.moveTo(shape.points[0].x, shape.points[0].y);
    shape.points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.fill();
  }

  drawDot(ctx: CanvasRenderingContext2D, shape: Shape) {
    const circle = new Path2D();
    circle.arc(shape.points[0].x, shape.points[0].y, 1, 0, 2 * Math.PI);
    ctx.fill(circle);
  }

  hitomezashiSquare = (options: SquareOptions) => {
    const xSize = options.size;
    const ySize = options.size;
    const xValues = AppComponent.getOnOffArray(xSize, options.xOn, options.xOff, options.xProb);
    const yValues = AppComponent.getOnOffArray(ySize, options.yOn, options.yOff, options.yProb);

    const ctx = AppComponent.getCanvas();

    ctx.fillStyle = 'green';

    for (let i = 0; i < xSize; i += 1) {
      for (let j = 0; j < ySize; j += 1) {
        const circle = new Path2D();
        circle.arc(AppComponent.getPoint(i, xSize), AppComponent.getPoint(j, ySize), 1, 0, 2 * Math.PI);
        ctx.fill(circle);
      }
    }

    this.squareService.getLines(xValues, yValues, xSize, ySize)
      .forEach(line => this.drawLine(ctx, line));

    if (options.colourBool) {
      this.squareService.getShapes(xValues, yValues, xSize, ySize, [options.colour1, options.colour2])
        .forEach(shape => this.drawShape(ctx, shape));
    }
  };

  clearCanvas() {
    const ctx = AppComponent.getCanvas();
    ctx.clearRect(0, 0, 1000, 1000);
  }

  drawIsometric(options: IsometricOptions) {
    this.clearCanvas();

    AppComponent.hitomezashiIsometric(options);
  }

  drawSquare(options: SquareOptions) {
    this.clearCanvas();

    this.hitomezashiSquare(options);
  }
}
