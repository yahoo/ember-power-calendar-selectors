/**
 * Copyright (c) 2018 Oath Inc.
 */

import PowerCalendarSelectorMultiple from 'ember-power-calendar-selectors/components/power-calendar-selector/multiple/component'
import Years from '../years';

export default PowerCalendarSelectorMultiple.extend(Years).extend({
  actions: {
    /**
     * @action selectYear
     * @param {Date} year 
     * @param {Object} calendar 
     * @param {Event} ev 
     * @override
     */
    selectYear(year, calendar, ev) {
      const { publicAPI: {
        onSelect, 
        onSelectYear,
        calendar: { selected }
      } } = this;

      const nextRange = this._buildCollection({ date: selected }, year);

      if (onSelectYear) onSelectYear(nextRange, calendar, ev);
      if (onSelect) onSelect(nextRange, calendar, ev);
  
      calendar.actions.select(year, calendar, ev);
    },
  }
});
