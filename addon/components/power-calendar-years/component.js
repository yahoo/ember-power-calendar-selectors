import Component from "@ember/component";
import layout from './template';
import { PropTypes } from 'ember-prop-types';


export default Component.extend({
  layout,
  tagName: '',
  type: 'single',
  propTypes: {
    calendar: PropTypes.object,
    format: PropTypes.string,
    onSelect: PropTypes.func,
    onSelectYear: PropTypes.func,
  },
});