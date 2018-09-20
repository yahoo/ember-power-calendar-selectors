import PowerCalendarSelectorRange from 'ember-power-calendar-selectors/components/power-calendar-selector/range/component'
import Years from '../years';
import { diff } from 'ember-power-calendar-utils';

export default PowerCalendarSelectorRange.extend(Years).extend({
  actions: {
    selectYear(year, calendar, ev) {
      const { publicAPI: { 
        onSelectYear, onSelect 
      } } = this;

      // Call onSelect of parent if it exists
      calendar.actions.select(year, calendar, ev);

      // Call onSelectYear if it exists
      if (onSelectYear || onSelect) {
        // Compute range
        const range = this._buildRange(year);
        const { start, end } = range.date;
  
        if (start && end) {
          const { minRange, maxRange } = calendar;
          const diffInMs = Math.abs(diff(end, start));
  
          if (diffInMs < minRange || maxRange && diffInMs > maxRange) {
            return;
          }
        }

        if (onSelectYear) onSelectYear(range, calendar, ev);
        if (onSelect) onSelect(range, calendar, ev);
      }
    },
  },
});
