/**
 * Copyright (c) 2018 Oath Inc.
 */

import { computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import layout from './template';

import {
  add,
  isBefore,
  isSame,
} from 'ember-power-calendar-utils';


export default {
  classNames: ['ember-power-calendar-selector-years'],
  propTypes: {},
  layout,

  /**
   * @property {String} period
   * @override
   */
  period: 'year',

  /**
   * @property {Array} years
   */
  years: computed(
    'focusedId',
    'publicAPI.{calendar,onSelect,onSelectYear,maxLength,maxDate,minDate,disabledDates.[]}',
    function() {
      const { publicAPI: { calendar }, period, powerCalendarService } = this;
      const thisYear = powerCalendarService.getDate();
      const lastYear = this.lastYear(calendar);

      const years = [];
      let year = this.firstYear(calendar);
      while (isBefore(year, lastYear) || isSame(year, lastYear)) {
        years.push(this.buildPeriod(year, thisYear, calendar));
        year = add(year, 1, period);
      }

      assert('there should be 12 years', years.length === 12);
      return years;
    },
  ),

  actions: {
    /**
     * @action selectYear - fired on year selection
     * 
     * @param {Object} year 
     * @param {Object} calendar 
     * @param {Event} ev 
     */
    selectYear(year, calendar, ev) {
      const { onSelect, onSelectYear } = this.publicAPI;

      if (onSelectYear) onSelectYear(year, calendar, ev);
      if (onSelect) onSelect(year, calendar, ev);
      calendar.actions.select(year, calendar, ev);
    },

    /**
     * @action keyDown - Handles arrow navigation with focus
     * @param {Object} calendar 
     * @param {Event} ev
     */
    keyDown(calendar, ev) {
      const { focusedId, rowWidth, years } = this;

      if (focusedId) {

        // find the year
        const idx = years.findIndex(year => year.id === focusedId);
        let year;

        // up arrow
        if (ev.keyCode === 38) {
          ev.preventDefault();
          let newYearIdx = Math.max(idx - rowWidth, 0);
          for (let i = newYearIdx; i <= idx; i++) {
            year = years[i];

            if (!year.isDisabled) break;
          }
        
        // down arrow
        } else if (ev.keyCode === 40) {
          ev.preventDefault();
          let newYearIdx = Math.min(idx + rowWidth, years.length - 1);
          for (let i = newYearIdx; i >= idx; i--) {
            year = years[i];

            if (!year.isDisabled) break;
          }

        // left arrow
        } else if (ev.keyCode === 37) {
          year = years[Math.max(idx - 1, 0)];
          if (year.isDisabled) return;

        // right arrow
        } else if (ev.keyCode === 39) {
          year = years[Math.min(idx + 1, years.length - 1)];
          if (year.isDisabled) return;

        } else {
          return;
        }
        this.set('focusedId', year.id);
        scheduleOnce('afterRender', this, '_focusDate', year.id);
      }
    }
  },

  /**
   * @method buildPeriod
   * @param {Date} date 
   * @param {Date} thisYear 
   * @param {Object} calendar 
   * @returns {Boolean}
   * @override
   */
  buildPeriod(date, thisYear, calendar) {
    const year = this._super(...arguments);
    const { period } = this;

    return Object.assign({}, year, {
      isCurrentYear: isSame(date, thisYear, period),
      isCurrentDecade: this._getDecade(date) !== this._getDecade(calendar.center),
    });
  },

  /**
   * @method isDisabled
   * @param {Date} month 
   * @returns {Boolean}
   * @override
   */
  isDisabled(/*month*/) {
    const disabled = this._super(...arguments);
    const { onSelect, onSelectYear } = this.publicAPI;

    return disabled || !onSelect && !onSelectYear;
  },

  /**
   * Find the first year of the centered decade
   * 
   * @method firstYear
   * @param {Object} calendar
   * @returns {Date}
   */
  firstYear(calendar) {
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return new Date(this._getDecade(calendar.center) - 1, 0);
  },

  /**
   * Finds the last year of the centered decade
   * 
   * @method lastYear
   * @param {Object} calendar 
   * @returns {Date}
   */
  lastYear(calendar) {
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return new Date(this._getDecade(calendar.center) + 10, 0);
  },

  /**
   * Gets the decade of the date
   * 
   * @method _getDecade
   * @param {Date} date 
   * @returns {Number}
   * @private
   */
  _getDecade(date) {
    const year = date.getFullYear();

    return year - year % 10;
  },
};
