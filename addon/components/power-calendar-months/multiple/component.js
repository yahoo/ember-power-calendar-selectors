/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 */
import PowerCalendarSelectorMultiple from 'ember-power-calendar-selectors/components/power-calendar-selector/multiple/component';
import Months from '../months';
import { getProperties } from '@ember/object';

/**
 * Months multiple selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelectorMultiple
 * @mixes Months
 */
export default PowerCalendarSelectorMultiple.extend(Months).extend({
  actions: {
    /**
     * @action select - fired on date selection
     * 
     * @param {Object} dateObj 
     * @param {Object} calendar 
     * @param {Event} ev 
     * @override
     */
    select(dateObj, calendar, ev) {
      const {
        'publicAPI.calendar.actions.select': select,
        'publicAPI.onSelect': onSelect,
      } = getProperties(this,
        'publicAPI.calendar.actions.select',
        'publicAPI.onSelect',
      );

      switch (dateObj.period) {
        case "quarter":
          if (onSelect) onSelect(dateObj, calendar, ev);
          if (select) select(dateObj.months, calendar, ev);
          break;
        default: 
          this._super(...arguments);
      }
    },
  },
});
