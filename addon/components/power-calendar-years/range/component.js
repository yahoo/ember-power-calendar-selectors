/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 * Please see LICENSE file in the project root for terms
 */

import PowerCalendarSelectorRange from 'ember-power-calendar-selectors/components/power-calendar-selector/range/component'
import Years from '../years';

/**
 * Years range selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelectorRange
 * @mixes Years
 */
export default PowerCalendarSelectorRange.extend(Years);