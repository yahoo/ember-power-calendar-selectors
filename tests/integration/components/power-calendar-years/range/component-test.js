import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from 'dummy/tests/assertions';

let calendarService, calendar, center;
module('Integration | Component | power-calendar-years/range', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    center = new Date(2010, 0);
    calendarService = this.get('owner').lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      center: center,
      locale: 'en',
      actions: {
        moveCenter: () => {},
        select: () => {},
      },
    };
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('it renders', async function(assert) {
    this.set('calendar', calendar);

    await render(hbs`{{power-calendar-years/range publicAPI=(hash
      calendar=calendar
      format="YYYY"
    )}}`);

    assert.equal(
      this.get('element').textContent.replace(/\s+/g, ' ').trim(), 
      '2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020',
    );
  });

  test('when it receives a range in the `selected` argument containing `Date` objects, the range in years is highlighted', async function(assert) {
    assert.expect(3);
    this.selected = { start: new Date(2016, 0), end: new Date(2020, 0) };

    await render(hbs`
      {{#power-calendar-range selected=selected center=center as |calendar|}}
        {{power-calendar-years/range publicAPI=(hash
          calendar=calendar
          format="YYYY"
        )}}
      {{/power-calendar-range}}
    `);

    let allYearsInRangeAreSelected = this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]').classList.contains('ember-power-calendar-selector-year--selected')
      && this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2017"]').classList.contains('ember-power-calendar-selector-year--selected')
      && this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2018"]').classList.contains('ember-power-calendar-selector-year--selected')
      && this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2019"]').classList.contains('ember-power-calendar-selector-year--selected')
      && this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2020"]').classList.contains('ember-power-calendar-selector-year--selected');
    assert.ok(allYearsInRangeAreSelected, 'All years in range are selected');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass(
      'ember-power-calendar-selector-year--range-start',
      'The start of the range has a special class',
    );
    assert.dom('.ember-power-calendar-selector-year[data-date="2020"]').hasClass(
      'ember-power-calendar-selector-year--range-end',
      'The end of the range has a special class',
    );
  }); 
});
