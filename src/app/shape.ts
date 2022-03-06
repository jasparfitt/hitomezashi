import { Point } from './point';

export class Shape {
  constructor(
    public colour: string,
    public points: Array<Point>,
  ) { }
}