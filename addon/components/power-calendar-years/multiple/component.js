import PowerCalendarSelectorMultiple from 'ember-power-calendar-selectors/components/power-calendar-selector/multiple/component'
import Years from '../years';

export default PowerCalendarSelectorMultiple.extend(Years).extend({
  actions: {
    selectYear(year, calendar, e) {
      const { publicAPI: {
        onSelect, 
        onSelectYear,
        calendar: { selected }
      } } = this;

      const nextRange = this._buildCollection({ date: selected }, year);

      if (onSelectYear) onSelectYear(nextRange, calendar, e);
      if (onSelect) onSelect(nextRange, calendar, e);
  
      calendar.actions.select(year, calendar, e);
    },
  }
});
