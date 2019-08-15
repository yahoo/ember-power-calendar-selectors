export function isCalendar(calendar) {
  return !!calendar
    && calendar.hasOwnProperty('center')
    && typeof calendar.loading === 'boolean'
    && calendar.hasOwnProperty('locale')
    && calendar.hasOwnProperty('selected')
    && calendar.hasOwnProperty('uniqueId')
    && calendar.hasOwnProperty('actions');
}

export function isMonth(month) {
  return typeof month.isCurrentMonth === 'boolean'
    && typeof month.isSelected === 'boolean'
    && typeof month.isFocused === 'boolean'
    && typeof month.isCurrentMonth === 'boolean'
    && typeof month.isDisabled === 'boolean'
    && typeof month.id === 'string'
    && month.date instanceof Date
    && month.period === 'month';
}

export function isQuarter(quarter) {
  return typeof quarter.isSelected === 'boolean'
    && typeof quarter.id === 'string'
    && typeof quarter.label === 'string'
    && Array.isArray(quarter.months)
    && quarter.date instanceof Date
    && quarter.period === 'quarter';
}

export function isYear(year) {
  return typeof year.isSelected === 'boolean'
    && typeof year.isFocused === 'boolean'
    && typeof year.isCurrentYear === 'boolean'
    && typeof year.isCurrentDecade === 'boolean'
    && typeof year.isDisabled === 'boolean'
    && typeof year.id === 'string'
    && year.date instanceof Date
    && year.period === 'year';
}
