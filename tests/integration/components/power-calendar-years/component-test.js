import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent, click, focus } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from 'dummy/tests/assertions';

let calendarService, calendar;
module('Integration | Component | power-calendar-years', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    calendarService = this.get('owner').lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      center: calendarService.getDate(),
      locale: 'en',
      actions: {
        moveCenter: () => {},
        select: () => {},
      },
      type: 'single'
    };
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('it renders', async function(assert) {
    this.set('calendar', calendar);

    await render(hbs`{{power-calendar-years calendar=calendar}}`);
    assert.equal(
      this.get('element').textContent.replace(/\s+/g, ' ').trim(), 
      '2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020'
    );
  });

  test('Clicking one day or year triggers call of `onSelect` action with that correct arugments', async function(assert) {
    assert.expect(4);
    this.set('didChange', function(year, calendar, e) {
      assert.isYear(year, 'The first argument is a year object');
      assert.isCalendar(calendar, 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
      assert.equal(year.id, '2013', 'id matches clicked element');
    });
    await render(hbs`
      {{#power-calendar onSelect=(action didChange) as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-years calendar=calendar}}
      {{/power-calendar}}
    `);
    await click('.ember-power-calendar-selector-year[data-date="2013"]');
  });

  test('When the user tries to focus a disabled year date with the left arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.minDate = new Date(2016, 0);
    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") selected=selected as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-years calendar=calendar minDate=minDate}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-year[data-date="2016"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-year[data-date="2016"]', 'keydown', 37); // left arrow
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));
  });

  test('When the user tries to focus a disabled year date with the up arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.minDate = new Date(2016, 0);
    await render(hbs`
      {{#power-calendar selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-years calendar=calendar minDate=minDate}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-year[data-date="2016"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-year[data-date="2016"]', 'keydown', 38); // up arrow
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));
  });

  test('When the user tries to focus a disabled year date with the right arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.maxDate = new Date(2016, 0);
    await render(hbs`
      {{#power-calendar selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-years calendar=calendar maxDate=maxDate}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-year[data-date="2016"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-year[data-date="2016"]', 'keydown', 39); // right arrow
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));
  });

  test('When the user tries to focus a disabled year date with the down arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.maxDate = new Date(2016, 0);
    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") selected=selected as |calendar|}}
        {{calendar.nav}}
        {{power-calendar-years calendar=calendar maxDate=maxDate}}
      {{/power-calendar}}
    `);

    await focus('.ember-power-calendar-selector-year[data-date="2016"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));

    await triggerKeyEvent('.ember-power-calendar-selector-year[data-date="2016"]', 'keydown', 40); // down arrow
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').hasClass('ember-power-calendar-selector-year--focused');
    assert.equal(document.activeElement, this.get('element').querySelector('.ember-power-calendar-selector-year[data-date="2016"]'));
  });

  test('If the user passes `disabledDates=someDate` to single calendars, years on those dates are disabled', async function(assert) {
    assert.expect(8);
    this.disabledDates = [
      new Date(2015, 0),
      new Date(2016, 0)
    ];

    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") selected=selected as |calendar|}}
        {{power-calendar-years calendar=calendar disabledDates=disabledDates}}
      {{/power-calendar}}
    `);

    assert.dom('.ember-power-calendar-selector-year[data-date="2010"]').isNotDisabled('2010 is enabled');
    assert.dom('.ember-power-calendar-selector-year[data-date="2014"]').isNotDisabled('2014 is enabled');
    assert.dom('.ember-power-calendar-selector-year[data-date="2015"]').isDisabled('2015 is disabled');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isDisabled('2016 is disabled');

    run(() => this.set('disabledDates', [new Date(2010, 0)]));
    assert.dom('.ember-power-calendar-selector-year[data-date="2010"]').isDisabled('2010 is disabled');
    assert.dom('.ember-power-calendar-selector-year[data-date="2014"]').isNotDisabled('2014 is enabled');
    assert.dom('.ember-power-calendar-selector-year[data-date="2015"]').isNotDisabled('2015 is enabled');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isNotDisabled('2016 is enabled');
  });
});
