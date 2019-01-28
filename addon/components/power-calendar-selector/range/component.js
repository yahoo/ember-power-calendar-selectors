/**
 * Copyright (c) 2018 Oath Inc.
 */

import { get, getProperties } from '@ember/object';
import PowerCalendarSelector from '../component';

import {
  diff,
  isAfter,
  isBefore,
  isBetween,
  isSame,
  normalizeRangeActionValue,
} from 'ember-power-calendar-utils';

/**
 * Range selector component abstract class.  Implements
 * basic range selection logic.
 * 
 * @class
 * @extends PowerCalendarSelector
 */
export default PowerCalendarSelector.extend({
  /**
   * @method buildPeriod
   * @param {Date} date 
   * @param {Date} now 
   * @param {Object} calendar 
   * @returns {Object}
   * @override
   */
  buildPeriod(date, now, calendar) {
    const periodObj = this._super(...arguments);
    const { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    const period = get(this, 'period');

    if (start && end) {
      periodObj.isRangeStart = periodObj.isSelected && isSame(date, start, period);
      periodObj.isRangeEnd = periodObj.isSelected && isSame(date, end, period);
    } else {
      periodObj.isRangeEnd = false;
      if (!start) {
        periodObj.isRangeStart = false;
      } else {
        periodObj.isRangeStart = periodObj.isSelected = isSame(date, start, period);
        if (!periodObj.isDisabled) {
          const diffInMs = Math.abs(diff(periodObj.date, start));
          periodObj.isDisabled = diffInMs < calendar.minRange
            || calendar.maxRange !== null && diffInMs > calendar.maxRange;
        }
      }
    }

    return periodObj;
  },

  /**
   * Should date be disabled?
   * 
   * @method isDisabled
   * @param {Date} date 
   * @returns {Boolean}
   */
  isDisabled(date) {
    const calendar = get(this, 'publicAPI.calendar');
    const range = this._buildRange({ date });
    const { start, end } = range.date;

    if (start && end) {
      const { minRange, maxRange } = getProperties(calendar, 'minRange', 'maxRange');
      const diffInMs = Math.abs(diff(end, start));

      if (diffInMs < minRange || maxRange && diffInMs > maxRange) {
        return true;
      }
    }

    return this._super(date);
  },

  /**
   * @method isSelected
   * @param {Date} date 
   * @param {Object} calendar 
   * @returns {Boolean}
   * @override
   */
  isSelected(date, calendar = this.get('publicAPI.calendar')) {
    const { selected = {} } = getProperties(calendar, 'selected');

    if (selected.hasOwnProperty('start') && selected.hasOwnProperty('end')) {
      const { start = null, end = null } = selected;
      const period = get(this, 'period');

      return start && (
        isSame(date, start, period) || end && (
          isSame(date, end, period) || isBetween(date, start, end, period, '[]')
        )
      );
    }

    return this._super(...arguments);
  },

  _buildRange(periodObj) {
    const {
      'publicAPI.calendar.proximitySelection': proximitySelection,
      'publicAPI.calendar.selected.end': end,
      'publicAPI.calendar.selected.start': start
    } = getProperties(this,
      'publicAPI.calendar.proximitySelection',
      'publicAPI.calendar.selected.end',
      'publicAPI.calendar.selected.start'
    );

    if (proximitySelection) {
      return this._buildRangeByProximity(periodObj, start, end);
    }

    return this._buildDefaultRange(periodObj, start, end);
  },

  /**
   * Builds a new period obj based on previous period obj 
   * and new start and end dates.  The range selection logic
   * is implemented here.
   * 
   * @method _buildRangeByProximity
   * @param {Object} periodObj 
   * @param {Date} start 
   * @param {Date} end 
   * @returns {Object}
   * @private
   */
  _buildRangeByProximity(periodObj, start, end) {
    if (start && end) {
      const changeStart = Math.abs(diff(periodObj.date, end)) > Math.abs(diff(periodObj.date, start));

      return normalizeRangeActionValue({
        date: {
          start: changeStart ? periodObj.date : start,
          end: changeStart ? end : periodObj.date
        }
      });
    }

    if (isBefore(periodObj.date, start)) {
      return normalizeRangeActionValue({ date: { start: periodObj.date, end: null } });
    }

    return this._buildDefaultRange(periodObj, start, end);
  },

  /**
   * Builds a new default range.
   * 
   * @method _buildDefaultRange
   * @param {Object} periodObj 
   * @param {Date} start 
   * @param {Date} end 
   * @returns {Object}
   * @private
   */
  _buildDefaultRange(periodObj, start, end) {
    if (start && !end) {
      if (isAfter(start, periodObj.date)) {
        return normalizeRangeActionValue({ date: { start: periodObj.date, end: start } });
      }
      return normalizeRangeActionValue({ date: { start: start, end: periodObj.date } });
    }

    return normalizeRangeActionValue({ date: { start: periodObj.date, end: null } });
  }
});
