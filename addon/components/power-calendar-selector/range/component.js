/**
 * Copyright (c) 2018 Oath Inc.
 */

import { getProperties } from '@ember/object';
import PowerCalendarSelector from '../component';

import {
  diff,
  isAfter,
  isBefore,
  isBetween,
  isSame,
  normalizeRangeActionValue,
} from 'ember-power-calendar-utils';


export default PowerCalendarSelector.extend({
  /**
   * @method buildPeriod
   * @param {Date} date 
   * @param {Date} currentDate 
   * @param {Object} calendar 
   * @returns {Object}
   * @override
   */
  buildPeriod(date, currentDate, calendar) {
    const periodObj = this._super(...arguments);
    const { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    const { period } = this;

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
   * @method isSelected
   * @param {Date} date 
   * @param {Object} calendar 
   * @returns {Boolean}
   * @override
   */
  isSelected(date, calendar = this.get('publicAPI.calendar')) {
    const { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    const { period } = this;

    return start && (
      isSame(date, start, period) || end && (
        isSame(date, end, period) || isBetween(date, start, end, period, '[]')
      )
    );
  },

  _buildRange(periodObj) {
    const {
      publicAPI: {
        selected: {
          start = null,
          end = null,
        } = {},
        proximitySelection,
      }
    } = this;

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
