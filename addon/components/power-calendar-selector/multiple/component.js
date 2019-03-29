/**
 * Copyright (c) 2018 Oath Inc.
 */

import { get } from '@ember/object';
import fallbackIfUndefined from 'ember-power-calendar/utils/computed-fallback-if-undefined';
import { isSame } from 'ember-power-calendar-utils';
import PowerCalendarSelector from '../component';

/**
 * Multiple selector component abstract class.  Implements
 * basic multiple selection logic.
 * 
 * @class
 * @extends PowerCalendarSelector
 */
export default PowerCalendarSelector.extend({
  /**
   * @property {Number}
   */
  maxLength: fallbackIfUndefined(Infinity),

  /**
   * @method isSelected
   * @param {Date} date 
   * @param {Object} calendar 
   * @returns {Boolean}
   * @override
   */
  isSelected(date, calendar = this.get('publicAPI.calendar')) {
    const selected = get(calendar, 'selected');
    const period = get(this, 'period');

    if (Array.isArray(selected)) {
      return selected.some((d) => isSame(date, d, period));
    }
    
    return this._super(...arguments);
  },

  /**
   * @method isDisabled
   * @param {Date} date 
   * @returns {Boolean}
   * @override
   */
  isDisabled(date) {
    const numSelected = this.get('publicAPI.calendar.selected.length') || 0;
    const maxLength = this.get('publicAPI.maxLength') || Infinity;
    
    return this._super(...arguments) || (numSelected >= maxLength && !this.isSelected(date));
  },
});
