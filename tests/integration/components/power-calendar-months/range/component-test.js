import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { isMonth, isCalendar, isQuarter } from 'dummy/tests/helpers/assertions';

let calendarService, calendar;
module('Integration | Component | power-calendar-months/range', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    calendarService = this.get('owner').lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      center: calendarService.getDate(),
      locale: 'en',
      actions: {
        moveCenter: () => {},
        select: () => {},
      },
    };
  });

  test('it renders', async function(assert) {
    this.set('calendar', calendar);

    await render(hbs`
      {{power-calendar-months/range
        publicAPI=(hash calendar=calendar format="MMM" firstQuarter=1 showQuarters=true)
      }}`,
    );

    assert.equal(
      this.get('element').textContent.replace(/\s+/g, ' ').trim(),
      'Q1 Q2 Q3 Q4 Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec',
    );
  });

  test('Clicking one day, month or quarter triggers call of `onSelect` action with that correct arugments', async function(assert) {
    assert.expect(15);

    this.set('didChangeCalendar', function(month, calendar, ev) {
      assert.ok(isMonth(month), 'The first argument is a month object');
      assert.ok(isCalendar(calendar), 'The second argument is the calendar\'s public API');
      assert.ok(ev instanceof Event, 'The third argument is an event');
      assert.equal(month.id, '2013-10', 'id matches clicked element');
    });

    this.set('didChangeSelector', function(month, calendar, ev) {
      assert.ok(isMonth(month), 'The first argument is a month object');
      assert.ok(isCalendar(calendar), 'The second argument is the calendar\'s public API');
      assert.ok(ev instanceof Event, 'The third argument is an event');
      assert.equal(month.id, '2013-10', 'id matches clicked element');
    });

    await render(hbs`
      {{#power-calendar onSelect=(action didChangeCalendar) as |calendar|}}
        {{power-calendar-months/range publicAPI=(hash
          calendar=calendar
          firstQuarter=1
          format="MMM"
          showQuarters=true
          onSelect=(action didChangeSelector)
        )}}
      {{/power-calendar}}
    `);
    await click('.ember-power-calendar-selector-month[data-date="2013-10"]');

    this.set('didChangeCalendar', function(dateObj, calendar, ev) {
      assert.ok(
        dateObj.date && dateObj.date.start instanceof Date && dateObj.date.start instanceof Date,
        'date obj has start and end dates',
      );
      assert.ok(isCalendar(calendar), 'The second argument is the calendar\'s public API');
      assert.ok(ev instanceof Event, 'The third argument is an event');
    });

    this.set('didChangeSelector', function(quarter, calendar, ev) {
      assert.ok(isQuarter(quarter), 'The first argument is a quarter object');
      assert.ok(isCalendar(calendar), 'The second argument is the calendar\'s public API');
      assert.ok(ev instanceof Event, 'The third argument is an event');
      assert.equal(quarter.id, '2013-Q1', 'id matches clicked element');
    });

    await click('.ember-power-calendar-selector-quarter[data-date="2013-Q1"]');
  });

});
