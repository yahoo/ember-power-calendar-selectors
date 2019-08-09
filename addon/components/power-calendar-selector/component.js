/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 * Please see LICENSE file in the project root for terms
 */

import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { get, getProperties } from '@ember/object';
import { PropTypes } from 'ember-prop-types';

import {
  formatDate,
  isAfter,
  isBefore,
  isSame,
  normalizeCalendarDay,
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
     * @action select - fired on date selection
     * 
     * @param {Object} dateObj 
     * @param {Object} calendar 
     * @param {Event} ev 
     */
    select(...args) {
      const {
        'publicAPI.calendar.actions.select': select,
        'publicAPI.onSelect': onSelect,
      } = getProperties(this,
        'publicAPI.calendar.actions.select',
        'publicAPI.onSelect',
      );

      if (onSelect) onSelect(...args);
      if (select) select(...args);
    },

    /**
     * Action run on year focus.
     * 
     * @action
     * @param {Object} year - selected dateObj
     */
    focus(year) {
      scheduleOnce('actions', this, this.get('_updateFocused'), year.id);
    },

    /**
     * Action run on component blue.
     * 
     * @action
     */
    blur() {
      scheduleOnce('actions', this, this.get('_updateFocused'), null);
    },
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
    const { period, focusedId } = getProperties(this, 'period', 'focusedId');

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
    const format = get(this, 'publicAPI.format');

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
  isSelected(date, calendar = this.get('publicAPI').calendar) {
    const period = get(this, 'period');
    const selected = get(calendar, 'selected');

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
    const {
      'publicAPI.disabledDates': disabledDates,
      'publicAPI.maxDate': maxDate,
      'publicAPI.minDate': minDate,
      period,
    } = getProperties(this, 
      'period',
      'publicAPI.disabledDates',
      'publicAPI.maxDate',
      'publicAPI.minDate',
    );

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
    let el = this.get('element').querySelector(`[data-date="${id}"]`);
    if (el) {
      el.focus();
    }
  },
});
