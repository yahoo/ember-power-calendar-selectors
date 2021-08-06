# ember-power-calendar-selectors [![Build Status](https://api.travis-ci.org/yahoo/ember-power-calendar-selectors.svg?branch=master)](https://travis-ci.org/yahoo/ember-power-calendar-selectors)
> Provides additional date selection components for [`ember-power-calendar`](https://ember-power-calendar.com/)

This project provides alternative date selection components that integrate with ember-power-calendar 
seamlessly.  Currently a months selector (for selecting over years) and a years selector (for 
selecting over decades) are implemented.

## Table of Content

- [Background](#background)
- [Install](#install)
- [Configuration](#configuration)
- [Usage](#usage)
- [Security](#security)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Background

`ember-power-calendar-selectors` was created to allow for more natural selection of dates in the month, quarter, and year
time grains.  It only uses the `ember-power-calendar` public API via the yeilded `calendar` object.

## Install

First install [`ember-cli-less`](https://github.com/gpoitch/ember-cli-less) or [`ember-cli-sass`](https://github.com/adopted-ember-addons/ember-cli-sass), `ember-power-calendar`, and 
`ember-power-calendar-selectors`
```shell
ember install ember-cli-less ember-power-calendar ember-power-calendar-selectors
```

Next import the required styles.

for example in `app/styles/app.less`
```less
@import "ember-power-calendar";
@import "ember-power-calendar-selectors";

.ember-power-calendar {
  .ember-power-calendar(@cell-size: 50px);
  .ember-power-calendar-selectors(@cell-size: 50px);
}
```

or in `app/styles/app.scss`
```scss
@import "ember-power-calendar";
@import "ember-power-calendar-selectors";

.ember-power-calendar {
  @include ember-power-calendar($cell-size: 50px);
  @include ember-power-calendar-selectors($cell-size: 50px);
}
```

The above will style all `.ember-power-calendar`s the same, feel free to 
use custom class names.

## Configuration

Beyond [Installation](#install), this project does not require other config.  Various scss variables can be set
on the ember power calendar selectors mixin to change it the selector's look and feel if desired.

## Usage

Usage of `ember-power-calendar-selectors` components is nearly the same as the default `ember-power-calendar`
`calendar.days` component.  The main difference is that the `calendar` object yielded by `power-calendar` must
be passed into the new `ember-power-calendar-selectors` selection components.

For example, here is an example of how to render a non-interactive years selector.
```hbs
<PowerCalendar as |calendar|>
  <PowerCalendarYears @calendar={{calendar}} />
</PowerCalendar>
```

For more details see the [API](#api).

## Security

This project doesn't have any security concerns. 

## API

### Years Selector
The `ember-power-calendar-selectors` addon provides the `power-calendar-months`, and `power-calendar-years` selector
components which work similarly to the `power-calendar`'s native `calendar.days` yielded component.  It renders selectors for all the years in a decade.

For example, here is an example of how to render a non-interactive years selector.
```hbs
<PowerCalendar as |calendar|>
  <PowerCalendarYears @calendar={{calendar}} />
</PowerCalendar>
```

When an `onSelect` handler is provided to `power-calendar` the `power-calendar-years` selector becomes interactive and sends events to the handler.
```hbs
<PowerCalendar 
  @selected={{selected}}
  @onSelect={{action (mut selected) value="date"}}
  as |calendar|
>
  <PowerCalendarYears @calendar={{calendar}} />
</PowerCalendar>
```

All the options implemented by `calendar.days` have been reimplemented by `power-calendar-years` as well.  For example,
```hbs
<PowerCalendar 
  @selected={{selected}}
  @onSelect={{action (mut selected) value="date"}}
  @minRange={{"2y"}}
  @maxRange={{"5y"}}
  as |calendar|
>
  <PowerCalendarYears @calendar={{calendar}} />
</PowerCalendar>
```
works as expected.  Be advised, `{min,max}Range` interpret `Number` values as days, no matter the subcomponent being rendered.  Pass in `"{number of years}y"` if the range should be specified in years as shown above.

Also, selectors can be used in concert without issue.  For instance,
```hbs
<PowerCalendar 
  @selected={{selected}}
  onSelect={{action (mut selected) value="date"}}
  @minRange={{"2y"}}
  @maxRange={{"5y"}}
  as |calendar|
>
  <calendar.days />
  <PowerCalendarYears @calendar={{calendar}} />
</PowerCalendar>
```
will work without a problem.

Finally, selector behavior has been implemented for all the `power-calendar` selection modes, single, range, and multiple. This,
```hbs
<PowerCalendarRange
  @selected={{selected}}
  @onSelect={{action (mut selected) value="date"}}
  as |calendar|
>
  <PowerCalendarYears @calendar={{calendar}} />
</PowerCalendarRange>
```
will work without further tweaking, as will `power-calendar-multiple`.

### Months Selector
The `power-calendar-months` component renders with selectors for the 12 months in a year and the quarters by default. It shares most of its API with `power-calendar-years` with a few notable exceptions.

#### `fisrtQuarter`
`firstQuarter` specifies the starting label of the first quarter. Defaults to `1`.
```hbs
<PowerCalendar
  @selected={{selected}}
  @onSelect={{action (mut selected) value="date"}}
  as |calendar|
>
  <PowerCalendarMonths @firstQuarter={{2}} @calendar={{calendar}} />
</PowerCalendar>
```
will render with the first quarter of the year as Q2.

#### `showQuarters`
Determines if the quarters should be rendered.  Defaults `true`.
```hbs
<PowerCalendar
  @selected={{selected}}
  @onSelect={{action (mut selected) value="date"}}
  as |calendar|
>
  <PowerCalendarMonths @showQuarters={{false}} @calendar={{calendar}} />
</PowerCalendar>
```
will not render with quarters, only months.


### Selectors Nav
It also provides the `power-calendar-selectors-nav` component.  This component can
be used as a more convenient nav for the months, and years selector.

For example, `power-calendar-selectors-nav` can be used to  navigate by decade instead of
month, convenient when using the years selector.  The `dateFormat` property can be used to 
provide custom date format strings.  We use [moment.js format strings](https://momentjs.com/docs/#/parsing/string-formats/).
```hbs
<PowerCalendar 
  @onCenterChange={{action (mut center) value="date"}}
  @center={{center}}
  as |calendar|
>
  <PowerCalendarSelectorsNav @dateFormat="Today is the Do of MMMM" @calendar={{calendar}} @by="decade" />
  <PowerCalendarYears @calendar={{calendar}} />
</PowerCalendar>
```

### onSelect Handler

All default behaviors can be handled through the power-calendar `onSelect` handler hook, just as in base ember power calendar.  For instance,

```hbs
<PowerCalendarRange 
  @onSelect={{action (mut selected)}}
  @selected={{selected}}
  as |cal|
>
  <PowerCalendarMonths @calendar={{cal}} />
</PowerCalendarRange>
```

Will now properly select the entire quarter range when a quarter is selected by the user.

Most users should have no issue using the default behavior provided by the ember-power-calendar actions.  However, the child selector `onSelect` will directly pass the user the selected dateObj allowing them full control of what is selected if the user requires it.  Because of this the child `onSelect` hook has different behavior that the parent component's on `onSelect` hook.

In the case that the user desires to discriminate between month and quarter selections, the child `onSelect` can be leveraged.
```hbs
<PowerCalendarMultiple @selected={{selected}} as |cal|>
  <PowerCalendarMonths 
    @onSelect={{action "handleSelect"}}
    @calendar={{cal}}
  />
</PowerCalendarMultiple>
```

```javascript
{ actions: {
  handleSelect(dateObj) {
    if (dateObj.period === 'quarter') console.log('you clicked a quarter');
    if (dateObj.period === 'month') console.log('you clicked a month');
  }
} }
```

In the case that both hooks are used all registered handlers fire in order of specificity.
```hbs
<PowerCalendarRange 
  @onSelect={{action (mut selected)}}
  {{!-- ^fires second --}}
  @selected={{selected}}
  as |cal|
>
  <PowerCalendarMonths 
    @onSelect={{action (mut selected)}}
    {{!-- ^fires first --}}
    @calendar={{cal}}
  />
</PowerCalendarRange>
```

## Contribute

Please refer to [the contributing.md file](Contributing.md) for information about how to get involved. We welcome issues, questions, and pull requests. Pull Requests are welcome.

## Maintainers

Alex Aralis: alex.aralis@verizonmedia.com

## License

This project is licensed under the [MIT License](LICENSE.md).
