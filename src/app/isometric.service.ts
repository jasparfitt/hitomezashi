import { Injectable } from '@angular/core';
import { Point } from './point';
import { Shape } from './shape';

@Injectable({
  providedIn: 'root',
})
export class IsometricService {
  getPoint = (xNum: number, yNum: number, n: number) => {
    const total = 1000;
    const unit = total / n;

    const xP = (xNum * unit) + (yNum * unit * 0.5) + (unit * 0.5);
    const yP = (unit * yNum * Math.sqrt(3) * 0.5) + (unit * 0.5);

    return new Point(xP, yP);
  };


  isPointOnGrid = (x: number, y: number, n: number) => x >= 0 && y >= 0 && (x + y) < n;

  getLines(xValues: Array<boolean>, yValues: Array<boolean>, zValues: Array<boolean>, size: number) {
    const lines: Array<Shape> = [];

    xValues.forEach((val, i) => {
      for (let j = 0; j < size; j += 2) {
        let xVal = j;

        if (!val) {
          xVal++;
        }

        const xStart = i - xVal;
        const yStart = xVal;
        const xEnd = xStart + 1;
        const yEnd = yStart - 1;

        if (this.isPointOnGrid(xStart, yStart, size) && this.isPointOnGrid(xEnd, yEnd, size)) {
          lines.push(new Shape('#000', [
            this.getPoint(xStart, yStart, size),
            this.getPoint(xEnd, yEnd, size),
          ]));
        }
      }
    });

    yValues.forEach((val, i) => {
      for (let j = 0; j < size; j += 2) {
        let xVal = j - 1;

        if (!val) {
          xVal += 1;
        }

        const xStart = xVal;
        const xEnd = xVal + 1;
        const yEnd = i;

        if (this.isPointOnGrid(xStart, i, size) && this.isPointOnGrid(xEnd, yEnd, size)) {
          lines.push(new Shape('#000', [
            this.getPoint(xStart, i, size),
            this.getPoint(xEnd, yEnd, size),
          ]));
        }
      }
    });

    zValues.forEach((val, i) => {
      const x = i;
      let y = 0;

      if (val) {
        y = 1;
      }

      for (let j = 0; j < size; j += 2) {
        const xStart = x;
        const yStart = j + y;
        const xEnd = x;
        const yEnd = yStart + 1;

        if (this.isPointOnGrid(xStart, yStart, size) && this.isPointOnGrid(xEnd, yEnd, size)) {
          lines.push(new Shape('#000', [
            this.getPoint(xStart, yStart, size),
            this.getPoint(xEnd, yEnd, size),
          ]));
        }
      }
    });

    return lines;
  }

  isOnGrid = (point: Point, size: number) => {
    const xSize = size - 1 - Math.ceil(point.y / 2);
    const ySize = (size * 2) - 3;

    return point.x >= 0 && point.y >= 0 && point.y < ySize && point.x < xSize;
  };

  // is there a line between two triangles i.e are they in the same shape
  lineBetween = (xValues: Array<boolean>, yValues: Array<boolean>, zValues: Array<boolean>, point1: Point, point2: Point, yEven: boolean) => {
    const xDiff = point1.x - point2.x;
    const yDiff = point1.y - point2.y;
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
        pointX = point1.x + 1;
        pointY = point1.y / 2;
      } else {
        pointX = point1.x;
        pointY = point1.y / 2;
      }
    } else {
      if (direction === 'y') {
        pointX = point1.x;
        pointY = Math.ceil(point1.y / 2);
      } else {
        pointX = point1.x + 1;
        pointY = Math.ceil(point1.y / 2) - 1;
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

  checkNeighbours = (xValues: Array<boolean>, yValues: Array<boolean>, zValues: Array<boolean>, point: Point, shapeNumber: number, grid: Array<Array<number>>, size: number) => {
    const yEven = !(point.y % 2);
    const neighbourPoints = [
      new Point(point.x, point.y - 1),
      new Point(point.x, point.y + 1),
    ];
    const pointsInSameShape: Array<Point> = [];
    const touchingShapes: Array<Array<number>> = [];

    if (yEven) {
      neighbourPoints.push(new Point(point.x - 1, point.y + 1));
    } else {
      neighbourPoints.push(new Point(point.x + 1, point.y - 1));
    }

    neighbourPoints.forEach(coord => {
      if (this.isOnGrid(coord, size) && !this.lineBetween(xValues, yValues, zValues, point, coord, yEven) && !grid[coord.x][coord.y]) {
        pointsInSameShape.push(coord);
        grid[coord.x][coord.y] = shapeNumber;
      } else if (this.isOnGrid(coord, size) && this.lineBetween(xValues, yValues, zValues, point, coord, yEven) && grid[coord.x][coord.y]) {
        const pair = [shapeNumber, grid[coord.x][coord.y]];
        pair.sort((a, b) => Math.sign(a - b));
        touchingShapes.push(pair);
      }
    });

    return { pointsInSameShape, touchingShapes };
  };

  getShapes(xValues: Array<boolean>, yValues: Array<boolean>, zValues: Array<boolean>, size: number, colours: Array<string>) {
    const shapeNumbers: Array<Array<number>> = [];

    for (let i = 0; i < size - 1; i++) {
      shapeNumbers.push([]);
    }

    let shapeNumber = 1;

    // number of rows of triangles ▼▲▼▲ = 2 rows (1 up facing, 1 down facing)
    const yLength = (size * 2) - 3;
    const connections: Array<Array<Array<number>>> = [];

    for (let j = 0; j < yLength; j++) {
      // number of triangles in this row
      const xLength = size - 1 - Math.ceil(j / 2);

      for (let i = 0; i < xLength; i++) {
        if (!shapeNumbers[i][j]) {
          shapeNumbers[i][j] = shapeNumber;

          let pointsToCheck = [new Point(i, j)];

          const num = shapeNumber;

          while (pointsToCheck.length !== 0) {
            let newPoints: Array<Point> = [];

            pointsToCheck.forEach(point => {
              const t = this.checkNeighbours(xValues, yValues, zValues, point, num, shapeNumbers, size);
              newPoints = newPoints.concat(t.pointsInSameShape);
              connections.push(t.touchingShapes);
            });

            pointsToCheck = newPoints;
          }

          shapeNumber++;
        }
      }
    }

    const connArray: Array<any> = connections.reduce((prev, val) => prev.concat(val), []).filter((item, pos, self) => {
      const index = self.findIndex(val => val[0] === item[0] && val[1] === item[1]);

      return index === pos;
    });

    const fourColours = colours;
    let shapeColours: Array<string> = [];
    const tempShapeColours: Array<string> = [];
    let runs: Array<number> = [];

    const checkColour = (i: number) => {
      runs[i] = (runs[i] ?? 0) + 1;
      if (runs[i] > 5000) {
        throw new Error('too many calls');
      }

      const neighbourNumbers = connArray
        // get all shapes that share a border with the i-th shape
        .filter(connection => connection[0] === i || connection[1] === i)
        .map(connection => connection[0] === i ? connection[1] : connection[0]);

      // get colours that border this shape
      const neighbourColours = neighbourNumbers.reduce((prev: Array<string>, c) => {
        if (tempShapeColours[c] !== undefined && !prev.includes(tempShapeColours[c])) {
          prev.push(tempShapeColours[c]);
        }

        return prev;
      }, []);

      // set colour of shape to one it does not border, if it borders all four colours noColour is true
      const noColour = [0, 1, 2, 3].every(v => {
        if (!neighbourColours.includes(fourColours[v])) {
          tempShapeColours[i] = fourColours[v];

          return false;
        }

        return true;
      });


      if (noColour) {
        // find how many shapes of each colour border this shape
        const colCount = neighbourNumbers.reduce((prev, c) => {
          if (tempShapeColours[c] !== undefined) {
            const ind = fourColours.indexOf(tempShapeColours[c]);
            prev[ind]++;
          }

          return prev;
        }, [0, 0, 0, 0]);

        // choose the colour that has the smallest number of bordering shapes
        let colInd = colCount.indexOf(Math.min(...colCount));

        // small chance to pick a different colour to avoid getting stuck in loop
        if (Math.random() > 0.9) {
          colInd = Math.floor(Math.random() * 4);
        }

        const chosenColour = fourColours[colInd];
        tempShapeColours[i] = chosenColour;
        const checkAgain: Array<number> = [];

        // for all neighbour shapes that have the chosen colour reset them and set new colours
        neighbourNumbers.forEach((num) => {
          if (tempShapeColours[num] !== undefined && tempShapeColours[num] === chosenColour) {
            delete tempShapeColours[num];
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
        for (let i = 1; i <= shapeNumber; i++) {
          checkColour(i);
        }
        runs[0] = 0;
      } catch (e) {
        if (attempts < 20) {
          doTheLoop();
        }
      }
    };

    doTheLoop();

    shapeColours = tempShapeColours;
    const shapes: Array<Shape> = [];

    shapeNumbers.forEach((row, i) => {
      row.forEach((number, j) => {
        let xDiff, yDiff;

        if (j % 2) {
          xDiff = 1;
          yDiff = -1;
        } else {
          xDiff = 0;
          yDiff = 1;
        }

        shapes.push(new Shape(shapeColours[number], [
          this.getPoint(i, Math.ceil(j / 2), size),
          this.getPoint(i + 1, Math.ceil(j / 2), size),
          this.getPoint(i + xDiff, Math.ceil(j / 2) + yDiff, size),
        ]));
      });
    });

    return shapes;
  }

  getGridPoints(size: number) {
    const points = [];

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        if ((i + j) < size) {
          points.push(new Shape('#0f0', [
            this.getPoint(i, j, size),
          ]));
        }
      }
    }

    return points;
  }
}
