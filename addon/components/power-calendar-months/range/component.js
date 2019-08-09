/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 * Please see LICENSE file in the project root for terms
 */
import PowerCalendarSelectorRange from 'ember-power-calendar-selectors/components/power-calendar-selector/range/component';
import Months from '../months';
import { getProperties } from '@ember/object';


/**
 * Months range selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelectorRange
 * @mixes Months
 */
export default PowerCalendarSelectorRange.extend(Months).extend({
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
          if (select) select(
            { date: {
              start: dateObj.months[0].date,
              end: dateObj.months[dateObj.months.length - 1].date,
            } },
            calendar,
            ev,
          );
          break;
        default: 
          this._super(...arguments);
      }
    },
  },
});
