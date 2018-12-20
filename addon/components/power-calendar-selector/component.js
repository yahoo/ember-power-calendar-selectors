/**
 * Copyright (c) 2018 Oath Inc.
 */

import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { PropTypes } from 'ember-prop-types';

import {
  formatDate,
  isAfter,
  isBefore,
  isSame,
  normalizeCalendarDay
} from 'ember-power-calendar-utils';


/**
 * Base selector component abstract class. Implements 
 * basic single selection logic.
 * 
 * @class
 * @extends Component
 */
export default Component.extend({
  classNames: ['ember-power-calendar-selector'],
  propTypes: {
    publicAPI: PropTypes.object.isRequired,
  },

  /**
   * @property {String} focusedId
   */
  focusedId: null,

  /**
   * @property {String} period
   */
  period: 'none',

  /**
   * @property {EmberService} powerCalendarService
   */
  powerCalendarService: inject('power-calendar'),

  /**
   * @property {Number} rowWidth
   */
  rowWidth: 3,

  actions: {
    /**
     * Action run on year focus.
     * 
     * @action
     * @param {Object} year - selected dateObj
     */
    focus(year) {
      scheduleOnce('actions', this, this._updateFocused, year.id);
    },

    /**
     * Action run on component blue.
     * 
     * @action
     */
    blur() {
      scheduleOnce('actions', this, this._updateFocused, null);
    }
  },

  /**
   * Used to construct the objects passed to callbacks
   * 
   * @method buildPeriod
   * @param {Date} date 
   * @param {Date} now 
   * @param {Object} calendar 
   * @returns {Object}
   */
  buildPeriod(date, now, calendar) {
    const id = this.getPeriodId(date);
    const { period, focusedId } = this;

    return normalizeCalendarDay({
      date: new Date(date),
      id,
      period,
      isDisabled: this.isDisabled(date),
      isFocused: focusedId === id,
      isSelected: this.isSelected(date, calendar),
    });
  },

  /**
   * Generates the id for the period from the start date
   * 
   * @method getPeriodId
   * @param {Date} date 
   * @returns {String}
   */
  getPeriodId(date) {
    const { publicAPI: { format } } = this;

    return formatDate(date, format);    
  },

  /**
   * Determines if date is selected.
   * 
   * @method isSelected
   * @param {Date} date 
   * @param {Object} calendar 
   * @returns {Boolean}
   */
  isSelected(date, calendar = this.calendar) {
    const { period } = this;
    const { selected } = calendar;

    return selected ? isSame(date, selected, period) : false;
  },

  /**
   * Determines if date is disabled.
   * 
   * @method isDisabled
   * @param {Date} date 
   * @returns {Boolean}
   */
  isDisabled(date) {
    const { period } = this;
    const { 
      disabledDates,
      maxDate,
      minDate,
    } = this.publicAPI;

    if (minDate && isBefore(date, minDate) && !isSame(date, minDate, period)) {
      return true;
    }

    if (maxDate && isAfter(date, maxDate) && !isSame(date, maxDate, period)) {
      return true;
    }

    if (disabledDates) {
      let disabledInRange = disabledDates.some((d) => {
        return isSame(date, d, period);
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  },

  /**
   * Updates the focused id
   * 
   * @method _updateFocused
   * @param {String} id 
   * @private
   */
  _updateFocused(id) {
    this.set('focusedId', id);
  },

  /**
   * Updates the focused control
   * 
   * @method _focusDate
   * @param {String} id
   * @private
   */
  _focusDate(id) {
    let el = this.element.querySelector(`[data-date="${id}"]`);
    if (el) {
      el.focus();
    }
  }
});
