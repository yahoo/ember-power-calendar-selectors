/**
 * Copyright (c) 2018 Oath Inc.
 */

import fallbackIfUndefined from 'ember-power-calendar/utils/computed-fallback-if-undefined';
import { isSame, normalizeMultipleActionValue } from 'ember-power-calendar-utils';
import PowerCalendarSelector from '../component';

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
    const selected = calendar.selected || [];
    const { period } = this;
    
    return selected.some((d) => isSame(date, d, period));
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

  /**
   * Used in a reduction to build multiselections
   * 
   * @method _buildCollection
   * @param {*} acc
   * @param {*} periodObj
   * @returns {Obejct}
   * @private
   */
  _buildCollection({ date: _selected } = {}, { date }) {
    const { period } = this;
    const selected = _selected || [];
    const index = selected.findIndex(s => isSame(date, s, period));

    let values = [];
    if (index === -1) {
      values = [...selected, date];
    } else {
      values = [...selected.slice(0, index), ...selected.slice(index + 1)];
    }

    return normalizeMultipleActionValue({ date: values });
  }
});
