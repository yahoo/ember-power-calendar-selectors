import Component from '@ember/component';
import layout from './template';

const PrivateLet = Component.extend({
  layout,
  tagName: '',
});

PrivateLet.reopenClass({
  positionalParams: ['arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6'],
});

export default PrivateLet;
