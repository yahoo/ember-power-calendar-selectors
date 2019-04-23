import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from 'dummy/tests/assertions';

let calendarService, calendar;
module('Integration | Component | power-calendar-selectors-nav', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    calendarService = this.owner.lookup('service:power-calendar');
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

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('it renders', async function(assert) {
    this.calendar = calendar;
    await render(hbs`{{power-calendar-selectors-nav calendar=calendar}}`);
    assert.equal(
      this.element.textContent.replace(/\s+/g, ' ').trim(),
      '« October 2013 »',
    );
  });

  test('it moves center', async function(assert) {
    assert.expect(12);
    this.calendar = calendar;

    await render(hbs`{{power-calendar-selectors-nav by=by calendar=calendar}}`);

    // test by months
    this.set('by', 'month');

    this.set('calendar.actions.moveCenter', (units, by) => {
      assert.equal(units, 1, 'move forward one');
      assert.equal(by, 'month', 'in months');
    })
    await click('.ember-power-calendar-selector-nav-control--next');

    this.set('calendar.actions.moveCenter', (units, by) => {
      assert.equal(units, -1, 'move back one');
      assert.equal(by, 'month', 'in months');
    })
    await click('.ember-power-calendar-selector-nav-control--previous');

    // test by years
    this.set('by', 'year');

    this.set('calendar.actions.moveCenter', (units, by) => {
      assert.equal(units, 1, 'move forward one');
      assert.equal(by, 'year', 'in years');
    })
    await click('.ember-power-calendar-selector-nav-control--next');

    this.set('calendar.actions.moveCenter', (units, by) => {
      assert.equal(units, -1, 'move back one');
      assert.equal(by, 'year', 'in years');
    })
    await click('.ember-power-calendar-selector-nav-control--previous');

    // test by decade
    this.set('by', 'decade');

    this.set('calendar.actions.moveCenter', (units, by) => {
      assert.equal(units, 10, 'move forward ten');
      assert.equal(by, 'year', 'in years');
    })
    await click('.ember-power-calendar-selector-nav-control--next');

    this.set('calendar.actions.moveCenter', (units, by) => {
      assert.equal(units, -10, 'move back ten');
      assert.equal(by, 'year', 'in years');
    })
    await click('.ember-power-calendar-selector-nav-control--previous');
  })
});
