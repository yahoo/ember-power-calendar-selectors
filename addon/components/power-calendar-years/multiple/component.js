/**
 * Copyright (c) 2018 Oath Inc.
 */

import { get, getProperties } from '@ember/object';
import PowerCalendarSelectorMultiple from 'ember-power-calendar-selectors/components/power-calendar-selector/multiple/component'
import Years from '../years';


/**
 * Years multiple selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelectorMultiple
 * @mixes Years
 */
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
      const onSelectYear = get(this, 'publicAPI.onSelectYear');
      const {
        'actions.select': select,
        selected
      } = getProperties(calendar,
        'actions.select',
        'selected'
      );

      if (onSelectYear) 
        onSelectYear(this._buildCollection({ date: selected }, year), calendar, ev);
      else if (select)
        select(year, calendar, ev);
    },
  },
});
