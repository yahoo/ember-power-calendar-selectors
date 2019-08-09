/**
 * Copyright 2019, Oath Inc.
 * Licensed under the terms of the MIT license.
 */
import PowerCalendarSelector from 'ember-power-calendar-selectors/components/power-calendar-selector/component';
import Months from '../months';


/**
 * Months single selection component concrete class.
 * 
 * @class
 * @extends PowerCalendarSelector
 * @mixes Months
 */
export default PowerCalendarSelector.extend(Months);
