import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IsometricOptions } from './isometric-form/isometric-form.component';
import { SquareOptions } from './square-form/square-form.component';
import { SquareService } from './square.service';
import { Shape } from './shape';
import { IsometricService } from './isometric.service';
import { PatternService } from './pattern.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export default class AppComponent {
  constructor(
    private squareService: SquareService,
    private isometricService: IsometricService,
    private patternService: PatternService,
  ) { }

  title = 'hitomezashi';

  debug = false;

  mode = new FormControl('square');

  getCanvas = (): CanvasRenderingContext2D => {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('hit-canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw Error('no context');
    }

    return ctx;
  };

  clearCanvas() {
    const ctx = this.getCanvas();
    ctx.clearRect(0, 0, 1000, 1000);
  }

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

  hitomezashiIsometric = (options: IsometricOptions) => {
    const size = options.size;
    const xValues = this.patternService.getOnOffArray(size, options.xOn, options.xOff, options.xProb);
    const yValues = this.patternService.getOnOffArray(size, options.yOn, options.yOff, options.yProb);
    const zValues = this.patternService.getOnOffArray(size, options.zOn, options.zOff, options.zProb);

    const ctx = this.getCanvas();

    if (this.debug) {
      this.isometricService.getGridPoints(size)
        .forEach(point => this.drawDot(ctx, point));
    }

    this.isometricService.getLines(xValues, yValues, zValues, size)
      .forEach(line => this.drawLine(ctx, line));

    if (options.colourBool) {
      this.isometricService.getShapes(xValues, yValues, zValues, size, [options.colour1, options.colour2, options.colour3, options.colour4])
        .forEach(shape => this.drawShape(ctx, shape));
    }
  };

  hitomezashiSquare = (options: SquareOptions) => {
    const xSize = options.size;
    const ySize = options.size;
    const xValues = this.patternService.getOnOffArray(xSize, options.xOn, options.xOff, options.xProb);
    const yValues = this.patternService.getOnOffArray(ySize, options.yOn, options.yOff, options.yProb);

    const ctx = this.getCanvas();

    if (this.debug) {
      this.squareService.getGridPoints(xSize, ySize)
        .forEach(point => this.drawDot(ctx, point));
    }

    this.squareService.getLines(xValues, yValues, xSize, ySize)
      .forEach(line => this.drawLine(ctx, line));

    if (options.colourBool) {
      this.squareService.getShapes(xValues, yValues, xSize, ySize, [options.colour1, options.colour2])
        .forEach(shape => this.drawShape(ctx, shape));
    }
  };

  drawIsometric(options: IsometricOptions) {
    this.clearCanvas();

    this.hitomezashiIsometric(options);
  }

  drawSquare(options: SquareOptions) {
    this.clearCanvas();

    this.hitomezashiSquare(options);
  }
}
