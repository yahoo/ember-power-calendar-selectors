/**
 * Copyright (c) 2019 Oath Inc.
 */

import { computed } from '@ember/object';
import { PropTypes } from 'ember-prop-types';
import Component from '@ember/component';
import fallbackIfUndefined from 'ember-power-calendar/utils/computed-fallback-if-undefined';
import layout from './template';

const templateMap = {
  'month': 'MMMM YYYY',
  'year': 'YYYY',
}

export default Component.extend({
  layout,
  tagName: '',

  propTypes: {
    by: PropTypes.oneOf(['month', 'year', 'decade']),
    calendar: PropTypes.object.isRequired,
    dateFormat: PropTypes.string,
    onCenterChange: PropTypes.func,
  },

  by: fallbackIfUndefined('month'),

  dateFormat: computed('by', function() {
    return templateMap[this.get('by')];
  }),

  decade: computed('calendar.center', function() {
    const center = this.get('calendar.center');
    const year = center.getFullYear();
    const decade = year - year % 10;

    return decade.toString();
  }),

  actions: {
    move(units) {
      const { by, calendar } = this;

      if (by === 'decade') {
        calendar.actions.moveCenter(10 * units, 'year', calendar);
      } else {
        calendar.actions.moveCenter(units, by, calendar);
      }
    },
  },
});
