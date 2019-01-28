/**
 * Copyright (c) 2018 Oath Inc.
 */

import { get } from '@ember/object';
import PowerCalendarSelectorRange from 'ember-power-calendar-selectors/components/power-calendar-selector/range/component'
import Years from '../years';

/**
 * Years range selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelectorRange
 * @mixes Years
 */
export default PowerCalendarSelectorRange.extend(Years).extend({
  actions: {
    /**
     * @action selectYear
     * @param {Date} year 
     * @param {Object} calendar 
     * @param {Event} ev 
     * @override
     */
    selectYear(year, calendar, ev) {
      const onSelectYear = get(this, 'publicAPI.onSelectYear');
      const select = get(calendar, 'actions.select');

      if (onSelectYear)
        onSelectYear(this._buildRange(year), calendar, ev);
      else if (select)
        select(year, calendar, ev);
    },
  },
});
