export const DEFAULT_ERROR_MESSAGE_MAP = {
  required: '{0} is required',
  containSpecialChars: '{0} should not contain special characters',
  containSpecialCharsExceptUnderscore: '{0} should not contain special characters except "_"',
  startWithNonAlpha: '{0} should start with an alphabet',
  startWithNonAlphaOrUnderscore: '{0} should start with an alphabet or underscore',
  duplicate: '{0} already exist',
  containSpace: '{0} should not contain space',
  invalidEmail: 'Email is not valid',
  invalidUrl: 'URL is not valid',
  invalidUrls: 'One or more {0} are not valid.',
  invalidPassword: `Password should be minimum 8 characters containing at least one number, 
    one lowercase and one uppercase letter.`,
  notEqual: 'Confirm password should match with new password'
};
