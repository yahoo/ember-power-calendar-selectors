/**
 * Copyright (c) 2018 Oath Inc.
 */

import Component from "@ember/component";
import layout from './template';
import { PropTypes } from 'ember-prop-types';
import fallbackIfUndefined from 'ember-power-calendar/utils/computed-fallback-if-undefined';


export default Component.extend({
  layout,
  tagName: '',
  type: 'single',
  format: fallbackIfUndefined('YYYY'),
  propTypes: {
    calendar: PropTypes.object.isRequired,
    disabledDates: PropTypes.arrayOf(PropTypes.date),
    format: PropTypes.string,
    maxDate: PropTypes.date,
    minDate: PropTypes.date,
    onSelect: PropTypes.func,
    onSelectYear: PropTypes.func,
  }
});