import { EmailValidatorDirective } from './email.validators';
import { PasswordValidatorDirective } from './password.validator';
import { IsEqualValidatorDirective } from './is-equal.validator';
import { Directive, Type } from '@angular/core';

export const COMMON_VALIDATORS: Array<Type<Directive>> = [
  EmailValidatorDirective,
  PasswordValidatorDirective,
  IsEqualValidatorDirective
];
