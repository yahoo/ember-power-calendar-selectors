/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 * Please see LICENSE file in the project root for terms
 */

import PowerCalendarSelector from 'ember-power-calendar-selectors/components/power-calendar-selector/component';
import Years from '../years';

/**
 * Years single selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelector
 * @mixes Years
 */
export default PowerCalendarSelector.extend(Years);
