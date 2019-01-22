import PowerCalendarSelectorMultiple from 'ember-power-calendar-selectors/components/power-calendar-selector/multiple/component';
import Months from '../months';


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
     * On month selection.
     * 
     * @action
     * @param {Object} month 
     * @param {Object} calendar 
     * @param {Event} ev 
     */
    selectMonth(month, calendar, ev) {
      const { publicAPI: { onSelectMonth } } = this;
      const { selected, actions: { select } } = calendar;

      if (onSelectMonth) 
        onSelectMonth(this._buildCollection({ date: selected }, month), calendar, ev);
      else if (select)
        select(month, calendar, ev);
    },

    /**
     * On quarter selection.
     * 
     * @action
     * @param {Object} quarter 
     * @param {Object} calendar 
     * @param {Event} ev 
     */
    selectQuarter(quarter, calendar, ev) {
      const { publicAPI: { onSelectQuarter } } = this;
      const { selected } = calendar;

      if (onSelectQuarter)
        onSelectQuarter(
          quarter.months.reduce(this._buildCollection.bind(this), { date: selected }), 
          calendar, 
          ev,
        );
    }
  }
});
