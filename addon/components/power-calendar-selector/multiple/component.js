import fallbackIfUndefined from 'ember-power-calendar/utils/computed-fallback-if-undefined';
import { isSame, normalizeMultipleActionValue } from 'ember-power-calendar-utils';
import PowerCalendarSelector from '../component';

export default PowerCalendarSelector.extend({
  maxLength: fallbackIfUndefined(Infinity),

  // Methods
  isSelected(date, calendar = this.get('publicAPI.calendar')) {
    const selected = calendar.selected || [];
    const { period } = this;
    
    return selected.some((d) => isSame(date, d, period));
  },

  isDisabled(date) {
    const numSelected = this.get('publicAPI.calendar.selected.length') || 0;
    const maxLength = this.get('publicAPI.maxLength') || Infinity;
    
    return this._super(...arguments) || (numSelected >= maxLength && !this.isSelected(date));
  },

  _buildCollection({ date: selected = [] } = {}, { date }) {
    const { period } = this;
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
