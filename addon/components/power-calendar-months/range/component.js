import PowerCalendarSelectorRange from 'ember-power-calendar-selectors/components/power-calendar-selector/range/component';
import Months from '../months';


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
     * @action selectMonth
     * @param {Date} month 
     * @param {Object} calendar 
     * @param {Event} ev 
     * @override
     */
    selectMonth(month, calendar, ev) {
      const { publicAPI: {
        calendar: { actions: { select } },
        onSelectMonth,
      } } = this;

      if (onSelectMonth)
        onSelectMonth(this._buildRange(month), calendar, ev);
      else if (select)
        select(month, calendar, ev);
    },

    /**
     * @action selectQuarter
     * @param {Date} quarter
     * @param {Object} calendar
     * @param {Event} ev
     * @override
     */
    selectQuarter(quarter, calendar, ev) {
      const { publicAPI: {
        calendar: { actions: { select } },
        onSelectQuarter,
      } } = this;

      if (onSelectQuarter) {
        const { months } = quarter;
        const start = months[0].date;
        const end = months[months.length - 1].date;
        const range = Object.assign({}, quarter, { date: { start, end } });

        onSelectQuarter(range, calendar, ev);
      } else if (select) {
        select(quarter, calendar, ev);
      }
    }
  }
});
