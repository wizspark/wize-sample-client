import * as moment from 'moment';

const isPlainObject = require('lodash/isPlainObject');
const isString = require('lodash/isString');
const isArray = require('lodash/isArray');
const forEach = require('lodash/forEach');

export class Utils {

  static words(str: string) {
    let reBasicWord = /[0-9.]+|[a-z0-9]+|[a-zA-Z0-9]+/g;
    return str.match(reBasicWord) || [];
  }

  static startCase(str: string) {
    if (!isString(str)) {
      return str;
    }
    return Utils.words(str)
      .map(token => token.toLowerCase())
      .map(token => token.charAt(0).toUpperCase() + token.slice(1))
      .join(' ');
  }

  static parseTimePatterns(value) {
    let tokens = /(now|eod|sod)(?:((?:-|\+)[0-9]+)([YMdhms]))*/.exec(value) || [],
      time;
    if (tokens[1] === 'now') {
      time = moment();
    }
    if (tokens[1] === 'sod') {
      time = moment().startOf('day');
    }
    if (tokens[1] === 'eod') {
      time = moment().endOf('day');
    }
    if (tokens[2] && tokens[3]) {
      time.add(+tokens[2], tokens[3]);
    }
    return (time && time.toDate()) || value;
  }

  static expandToSeconds(interval) {
    let tokens = interval.match(/(\d+)([smhdM])/);
    let val = tokens[1] && +tokens[1] || 0;
    switch (tokens[2]) {
      case 'm':
        val = val * 60;
        break;
      case 'h':
        val = val * 60 * 60;
        break;
      case 'd':
        val = val * 60 * 60 * 24;
        break;
      case 'M':
        val = val * 60 * 60 * 24 * 30;
        break;
      default:
        break;
    }
    return val;
  }
}
