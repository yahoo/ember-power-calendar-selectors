import { computed, set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import layout from './template';

import {
  add,
  endOf,
  formatDate,
  isBefore,
  isSame,
  startOf,
} from 'ember-power-calendar-utils';


/**
 * Provides months logic to selector abstract component
 * classes.
 * 
 * @mixin Months
 */
export default {
  classNames: ['ember-power-calendar-selector-months'],
  layout,
  propTypes: {},

  /**
   * @property {String} _focusedId - currenlty focused cell
   * @private
   */
  _focusedId: null,

  /**
   * @property {String} period
   * @override
   */
  period: 'month',

  /**
   * Array of quarters objects to be rendered
   * 
   * @property {Array} _quarters
   * @private
   */
  _quarters: computed(
    'focusedId',
    'publicAPI.{calendar,calendar.seleted.[],minDate,maxDate,disabledDates.[],onSelect,onSelectQuarter,firstQuarter,maxLength}',
    function() {
      const {
        rowWidth,
        powerCalendarService,
        period,
        publicAPI: { calendar }
      } = this;
      
      const thisMonth = powerCalendarService.getDate();
      const lastMonth = this.lastMonth(calendar);
      let month = this.firstMonth(calendar);

      const months = [];
      while (isBefore(month, lastMonth) || isSame(month, lastMonth)) {
        months.push(this.buildPeriod(month, thisMonth, calendar));
        month = add(month, 1, period);
      }
      
      assert('there should be 12 months in every year', months.length === 12);

      const rows = Math.ceil(months.length / rowWidth);
      const quartersArray = [...Array(rows).keys()].map(q => months.slice(rowWidth*q, rowWidth*(q + 1)));
      const quartersObjects = quartersArray.map((months, idx) => this.buildQuarter(months, idx, calendar));

      return quartersObjects;
    },
  ),

  /**
   * Should the months be interactive?
   * 
   * @property {Boolean} _monthsInteractive
   */
  _monthsInteractive: computed.or('publicAPI.{onSelectMonth,calendar.actions.select}'),

  /**
   * Should the quarters be interactive?
   * 
   * @property {Boolean} _quartersInteractive
   */
  _quartersInteractive: computed.or('publicAPI.onSelectQuarter'),

  actions: {
    /**
     * @action selectMonth - fired on month selection
     * 
     * @param {Object} month 
     * @param {Object} calendar 
     * @param {Event} ev 
     */
    selectMonth(...args) {
      const { publicAPI: { 
        onSelectMonth,
        calendar: { actions: { select } },
      } } = this;

      if (onSelectMonth) 
        onSelectMonth(...args);
      else if (select)
        select(...args);
    },

    /**
     * @action selectQuarter - fired on quarter selection
     * 
     * @param {Object} quarter 
     * @param {Object} calendar 
     * @param {Event} ev 
     */
    selectQuarter(...args) {
      const { publicAPI: { 
        onSelectQuarter,
        calendar: { actions: { select } },
      } } = this;

      if (onSelectQuarter) 
        onSelectQuarter(...args);
      else if (select)
        select(...args);
    },

    /**
     * @action keyDown - Handles arrow navigation with focus
     * @param {Object} calendar 
     * @param {Event} ev
     */
    keyDown(calendar, ev) {
      const {
        focusedId,
        rowWidth,
        _quarters: quarters
      } = this;

      if (focusedId) {
        // find the month
        let month, qIdx, mIdx;

        for (qIdx = 0; qIdx < quarters.length; qIdx++) {
          let done = false;
          for(mIdx = 0; mIdx < quarters[qIdx].months.length; mIdx++) {
            if (quarters[qIdx].months[mIdx].id === focusedId) {
              done = true;
              break;
            }
          }
          if (done) break;
        }

        // up arrow
        if (ev.keyCode === 38) {
          ev.preventDefault();
          const newQuarterIdx = Math.max(qIdx - 1, 0);
          for (let i = rowWidth*newQuarterIdx + mIdx; i <= rowWidth*qIdx + mIdx; i++) {
            month = quarters[Math.floor(i/rowWidth)].months[i%rowWidth];

            if (!month.isDisabled) break;
          }
        
        // down arrow
        } else if (ev.keyCode === 40) {
          ev.preventDefault();
          const newQuarterIdx = Math.min(qIdx + 1, quarters.length - 1);
          for (let i = rowWidth*newQuarterIdx + mIdx; i >= rowWidth*qIdx + mIdx; i--) {
            month = quarters[Math.floor(i/rowWidth)].months[i%rowWidth];

            if (!month.isDisabled) break;
          }

        // left arrow
        } else if (ev.keyCode === 37) {
          month = quarters[qIdx].months[Math.max(mIdx - 1, 0)];
          if (month.isDisabled) {
            return;
          }

        // right arrow
        } else if (ev.keyCode === 39) {
          month = quarters[qIdx].months[Math.min(mIdx + 1, rowWidth - 1)];
          if (month.isDisabled) {
            return;
          }
        } else {
          return;
        }

        set(this, 'focusedId', month.id);
        scheduleOnce('afterRender', this, '_focusDate', month.id);
      }
    },
  },

  /**
   * @method buildPeriod
   * @param {Date} date 
   * @param {Date} thisMonth
   * @returns {Object}
   * @override
   */
  buildPeriod(date, thisMonth) {
    const month = this._super(...arguments);
    const { period } = this;

    return Object.assign({}, month, {
      isCurrentMonth: isSame(date, thisMonth, period),
    });
  },

  /**
   * @method getPeriodId
   * @param {Date} date 
   * @returns {String}
   * @override
   */
  getPeriodId(date) {
    return formatDate(date, 'YYYY-MM')
  },

  /**
   * Builds a quarter object from months objects
   * 
   * @method buildQuarter
   * @param {Array} months
   * @param {Number} idx
   * @param {Object} calendar
   * @returns {Object}
   */
  buildQuarter(months, idx, calendar) {
    return {
      id: `${months[0].date.getFullYear()}-${this._renderQuarter(idx)}`,
      label: this._renderQuarter(idx),
      isSelected: this.isQuarterSelected(months, calendar),
      isDisabled: this.isQuarterDisabled(months),
      months,
      period: 'quarter',
      date: months[0].date
    };
  },

  /**
   * If any month in quarter is selected, then quarter is
   * selected. 
   * 
   * @method isQuarterSelected
   * @param {Array} months 
   * @param {Object} calendar 
   * @returns {Boolean}
   */
  isQuarterSelected(months, calendar) {
    return months.some(m => this.isSelected(m.date, calendar));
  },

  /**
   * @method isQuarterDisabled
   * @returns {Boolean}
   */
  isQuarterDisabled() {
    return false;
  },
  
  

  /**
   * Returns the start of the first month of the centered year.
   * 
   * @method firstMonth
   * @param {Object} calendar 
   * @returns {Moment}
   */
  firstMonth(calendar) {
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return startOf(calendar.center, 'year');
  },

  /**
   * Returns the start of the last month of the centered year.
   * 
   * @method lastMonth
   * @param {Object} calendar 
   * @returns {Moment}
   */
  lastMonth(calendar) {
    const { period } = this;
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return startOf(endOf(calendar.center, 'year'), period);
  },

  /**
   * Takes quarter index `0-3` and renders 
   * the quarter in the form `Q<nth quarter>`.
   * 
   * Depends on the `firstQuarter`.
   * 
   * @method _renderQuarter
   * @param {Number} quarterIdx 
   * @returns {String}
   * @private
   */
  _renderQuarter(quarterIdx) {
    const { publicAPI: { firstQuarter } } = this;
    assert('firstQuarter must be between 1 and 4', firstQuarter >= 1 && firstQuarter <= 4);

    const firstQuarterIdx = firstQuarter - 1;
    return `Q${(quarterIdx + firstQuarterIdx) % 4 + 1}`
  },
};