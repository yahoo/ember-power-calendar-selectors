/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 * Please see LICENSE file in the project root for terms
 */

import PowerCalendarSelectorMultiple from 'ember-power-calendar-selectors/components/power-calendar-selector/multiple/component'
import Years from '../years';


/**
 * Years multiple selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelectorMultiple
 * @mixes Years
 */
export default PowerCalendarSelectorMultiple.extend(Years);
