import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, focus } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { isMonth, isCalendar, isQuarter } from 'dummy/tests/helpers/assertions';
import { run } from '@ember/runloop';

let calendarService, calendar;
module('Integration | Component | power-calendar-months/single', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    calendarService = this.get('owner').lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      center: calendarService.getDate(),
      locale: 'en',
      actions: {
        moveCenter: () => {},
      },
      type: 'single',
    };
  });

  test('[i18n] The name of the months respect the locale set in the calendar service', async function(assert) {
    this.set('center', new Date(2016, 10, 15));
    calendarService.set('locale', 'fr');

    await render(hbs`
      {{#power-calendar center=center as |calendar|}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          showQuarters=true
        )}}
      {{/power-calendar}}
    `);

    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-month-grid').textContent.replace(/\s+/g, ' ').trim(),
      'janv. févr. mars avr. mai juin juil. août sept. oct. nov. déc.',
    );

    calendarService.set('locale', 'en');
  });

  test('[i18n] The user can force a different locale from the one set the calendar service passing `calendar.locale="some-locale"`', async function(assert) {
    this.calendar = calendar;

    await render(hbs`
      {{power-calendar-months/single publicAPI=(hash
        calendar=calendar
        firstQuarter=1
        format="MMM"
        showQuarters=true
      )}}`,
    );

    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-month-grid').textContent.replace(/\s+/g, ' ').trim(),
      'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec',
    );

    run(() => this.set('calendar.locale', 'es'));
    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-month-grid').textContent.replace(/\s+/g, ' ').trim(),
      'ene. feb. mar. abr. may. jun. jul. ago. sep. oct. nov. dic.',
    );
  });

  test('The format of the months can be changed passing `format="<format string>"`', async function(assert) {
    this.calendar = calendar;
    this.format = 'MM'

    await render(hbs`
      {{power-calendar-months/single publicAPI=(hash
        calendar=calendar
        firstQuarter=1
        format=format
        showQuarters=true
      )}}
    `);

    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-month-grid').textContent.replace(/\s+/g, ' ').trim(),
      '01 02 03 04 05 06 07 08 09 10 11 12',
      'Grid rendered with MM format.',
    );

    run(() => this.set('format', 'MMMM'));
    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-month-grid').textContent.replace(/\s+/g, ' ').trim(),
      'January February March April May June July August September October November December',
      'Grid rendered with MMM format.',
    );
  });

  test('It can render without quarter labels', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render(hbs`
      {{power-calendar-months/single publicAPI=(hash
        calendar=calendar
        firstQuarter=1
        format=format
        showQuarters=false
      )}}
    `);

    assert.dom('.ember-power-calendar-selector-quarters').doesNotExist();
  });

  test('It can change the first quarter', async function(assert) {
    assert.expect(4);
    this.calendar = calendar;
    this.firstQuarter = 1;

    await render(hbs`
      {{power-calendar-months/single publicAPI=(hash
        calendar=calendar
        firstQuarter=firstQuarter
        format="MMM"
        showQuarters=true
      )}}
    `);

    assert.dom('.ember-power-calendar-selector-quarters').hasText('Q1 Q2 Q3 Q4');
    this.set('firstQuarter', 2);
    assert.dom('.ember-power-calendar-selector-quarters').hasText('Q2 Q3 Q4 Q1');
    this.set('firstQuarter', 3);
    assert.dom('.ember-power-calendar-selector-quarters').hasText('Q3 Q4 Q1 Q2');
    this.set('firstQuarter', 4);
    assert.dom('.ember-power-calendar-selector-quarters').hasText('Q4 Q1 Q2 Q3');
  });

  test('It can renders interactive quarters if onSelect is set or if select action is provided', async function(assert) {
    assert.expect(3);
    this.calendar = calendar;

    await render(hbs`
      {{power-calendar-months/single publicAPI=(hash
        calendar=calendar
        firstQuarter=1
        format="MMM"
        showQuarters=true
      )}}
    `);

    assert.dom('.ember-power-calendar-selector-quarter.ember-power-calendar-selector-quarter--interactive').doesNotExist();

    this.set('handleQuarter', () => {});
    await render(hbs`
      {{power-calendar-months/single publicAPI=(hash
        calendar=calendar
        firstQuarter=1
        format="MMM"
        onSelect=handleQuarter
        showQuarters=true
      )}}
    `);

    assert.dom('.ember-power-calendar-selector-quarter.ember-power-calendar-selector-quarter--interactive').exists();

    this.set('calendar.actions.select', () => {});
    this.set('handleQuarter', () => {});
    await render(hbs`
      {{power-calendar-months/single publicAPI=(hash
        calendar=calendar
        firstQuarter=1
        format="MMM"
        showQuarters=true
      )}}
    `);

    assert.dom('.ember-power-calendar-selector-quarter.ember-power-calendar-selector-quarter--interactive').doesNotExist();
  });

  test('Clicking one day, month or quarter triggers call of `onSelect` action with that correct arugments', async function(assert) {
    assert.expect(16);

    this.set('didChange', function(month, calendar, e) {
      assert.ok(isMonth(month), 'The first argument is a month object');
      assert.ok(isCalendar(calendar), 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
      assert.equal(month.id, '2013-10', 'id matches clicked element');
    });

    await render(hbs`
      {{#power-calendar onSelect=(action didChange) as |calendar|}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          showQuarters=true
          onSelect=(action didChange)
        )}}
      {{/power-calendar}}
    `);
    await click('.ember-power-calendar-selector-month[data-date="2013-10"]');

    this.set('didChange', function(quarter, calendar, e) {
      assert.ok(isQuarter(quarter), 'The first argument is a quarter object');
      assert.ok(isCalendar(calendar), 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
      assert.equal(quarter.id, '2013-Q1', 'id matches clicked element');
    });
    await click('.ember-power-calendar-selector-quarter[data-date="2013-Q1"]');
  });

  test('If the user passes `disabledDates=someDate` to single calendars, months on those dates are disabled', async function(assert) {
    assert.expect(8);
    this.disabledDates = [
      new Date(2013, 8),
      new Date(2013, 9),
    ];

    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") selected=selected as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          disabledDates=disabledDates
          firstQuarter=1
          format="MMM"
          showQuarters=true
        )}}
      {{/power-calendar}}
    `);

    assert.dom('.ember-power-calendar-selector-month[data-date="2013-01"]').isNotDisabled('2013-01 is enabled');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-08"]').isNotDisabled('2013-08 is enabled');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-09"]').isDisabled('2013-09 is disabled');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').isDisabled('2013-10 is disabled');

    run(() => this.set('disabledDates', [new Date(2013, 0)]));
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-01"]').isDisabled('2013-01 is disabled');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-08"]').isNotDisabled('2013-08 is enabled');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-09"]').isNotDisabled('2013-09 is enabled');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').isNotDisabled('2013-10 is enabled');
  });

  test('When the user tries to focus a disabled month date with the left arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.minDate = new Date(2013, 9);

    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date")  selected=selected as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          minDate=minDate
          showQuarters=true
        )}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-month[data-date="2013-10"]');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-month[data-date="2013-10"]', 'keydown', 37); // left arrow
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));
  });

  test('When the user tries to focus a disabled month date with the up arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.minDate = new Date(2013, 9);

    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") selected=selected as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          minDate=minDate
          showQuarters=true
        )}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-month[data-date="2013-10"]');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-month[data-date="2013-10"]', 'keydown', 38); // up arrow
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));
  });

  test('When the user tries to focus a disabled month date with the right arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.maxDate = new Date(2013, 9);

    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") selected=selected as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          maxDate=maxDate
          showQuarters=true
        )}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-month[data-date="2013-10"]');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-month[data-date="2013-10"]', 'keydown', 39); // right arrow
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));
  });

  test('When the user tries to focus a disabled month date with the down arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.maxDate = new Date(2013, 9);
    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") selected=selected as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          maxDate=maxDate
          showQuarters=true
        )}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-month[data-date="2013-10"]');
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-month[data-date="2013-10"]', 'keydown', 40); // down arrow
    assert.dom('.ember-power-calendar-selector-month[data-date="2013-10"]').hasClass('ember-power-calendar-selector-month--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-month[data-date="2013-10"]'));
  });

  test('It renders quarters selected if any date inside the month is selected', async function(assert) {
    assert.expect(5);

    await render(hbs`
      {{#power-calendar selected=selected as |calendar|}}
        {{power-calendar-months/single publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          showQuarters=true
        )}}
      {{/power-calendar}}
    `);

    assert.dom('.ember-power-calendar-selector-quarter[data-date="2013-Q1"].ember-power-calendar-selector-quarter--selected').doesNotExist();

    this.set('selected', new Date(2013, 1, 5));
    assert.dom('.ember-power-calendar-selector-quarter[data-date="2013-Q1"].ember-power-calendar-selector-quarter--selected').exists();
    assert.dom('.ember-power-calendar-selector-quarter[data-date="2013-Q2"].ember-power-calendar-selector-quarter--selected').doesNotExist();

    this.set('selected', new Date(2013, 5, 2));
    assert.dom('.ember-power-calendar-selector-quarter[data-date="2013-Q2"].ember-power-calendar-selector-quarter--selected').exists();
    assert.dom('.ember-power-calendar-selector-quarter[data-date="2013-Q1"].ember-power-calendar-selector-quarter--selected').doesNotExist();
  });
});
