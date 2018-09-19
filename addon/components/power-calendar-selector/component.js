import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { PropTypes } from 'ember-prop-types';


import {
  formatDate,
  isAfter,
  isBefore,
  isSame,
  normalizeCalendarDay
} from 'ember-power-calendar-utils';

export default Component.extend({
  classNames: ['ember-power-calendar-selector'],
  propTypes: {
    publicAPI: PropTypes.object.isRequired,
  },

  focusedId: null,
  period: 'none',
  powerCalendarService: inject('power-calendar'),
  rowWidth: 3,

  // Actions
  actions: {
    focus(year) {
      scheduleOnce('actions', this, this._updateFocused, year.id);
    },

    blur() {
      scheduleOnce('actions', this, this._updateFocused, null);
    }
  },

  // Methods
  buildPeriod(date, thisYear, calendar) {
    const id = this.getPeriodId(date);
    const { period, focusedId } = this;

    return normalizeCalendarDay({
      date: new Date(date),
      id,
      period,
      isDisabled: this.isDisabled(date),
      isFocused: focusedId === id,
      isSelected: this.isSelected(date, calendar),
    });
  },

  getPeriodId(date) {
    const { publicAPI: { format } } = this;

    return formatDate(date, format);    
  },

  isSelected(date, calendar = this.calendar) {
    const { period } = this;
    const { selected } = calendar;

    return selected ? isSame(date, selected, period) : false;
  },

  isDisabled(date) {
    const { period } = this;
    const { 
      disabledDates,
      maxDate,
      minDate,
    } = this.publicAPI;

    if (minDate && isBefore(date, minDate) && !isSame(date, minDate, period)) {
      return true;
    }

    if (maxDate && isAfter(date, maxDate) && !isSame(date, maxDate, period)) {
      return true;
    }

    if (disabledDates) {
      let disabledInRange = disabledDates.some((d) => {
        return isSame(date, d, period);
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  },

  _updateFocused(id) {
    this.set('focusedId', id);
  },

  _focusDate(id) {
    let el = this.element.querySelector(`[data-date="${id}"]`);
    if (el) {
      el.focus();
    }
  }
});
