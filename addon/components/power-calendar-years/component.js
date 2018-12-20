/**
 * Copyright (c) 2018 Oath Inc.
 */

import Component from "@ember/component";
import layout from './template';
import { PropTypes } from 'ember-prop-types';
import fallbackIfUndefined from 'ember-power-calendar/utils/computed-fallback-if-undefined';

/**
 * Years wrapper component class.  Requires the 
 * ember-power-calendar public api object yielded 
 * by the `power-calendar` series of components as 
 * the calendar property and automatically chooses the
 * correct sub component to render based on context.
 * 
 * @class
 * @extends Component
 */
export default Component.extend({
  layout,
  tagName: '',

  /**
   * @property {String} format
   */
  format: fallbackIfUndefined('YYYY'),
  
  propTypes: {
    calendar: PropTypes.object.isRequired,
    disabledDates: PropTypes.arrayOf(PropTypes.date),
    format: PropTypes.string,
    maxDate: PropTypes.date,
    minDate: PropTypes.date,
    onSelectYear: PropTypes.func,
  }
});