/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 * Please see LICENSE file in the project root for terms
 */

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
