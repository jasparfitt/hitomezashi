import { tooSmallValidator } from './too-small-validator.directive';

describe('TooSmallValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = tooSmallValidator(0);
    expect(directive).toBeTruthy();
  });
});
