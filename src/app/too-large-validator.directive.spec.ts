import { tooLargeValidator } from './too-large-validator.directive';

describe('TooLargeValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = tooLargeValidator(1);
    expect(directive).toBeTruthy();
  });
});
