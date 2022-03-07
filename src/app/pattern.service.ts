import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PatternService {
  randBool = (p: number) => Math.random() > p;

  getOnOffArray = (
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

      if (!this.randBool(prob)) {
        boolVal = !boolVal;
      }

      values.push(boolVal);
    }

    return values;
  };
}
