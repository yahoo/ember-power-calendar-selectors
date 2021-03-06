import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let calendarService, calendar, center;
module('Integration | Component | power-calendar-years/multiple', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    center = new Date(2010, 0);
    calendarService = this.get('owner').lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      center,
      locale: 'en',
      actions: {
        moveCenter: () => {},
        select: () => {},
      },
      type: 'multiple',
    };
  });

  test('it renders', async function(assert) {
    this.set('calendar', calendar);

    await render(hbs`
      {{power-calendar-years/multiple publicAPI=(hash
        calendar=calendar
        format="YYYY"
      )}}
    `);

    assert.equal(
      this.get('element').textContent.replace(/\s+/g, ' ').trim(),
      '2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020',
    );
  });

  test('The maxLength property sets a maximum number of available years', async function(assert) {
    this.set('center', center);

    await render(hbs`
      {{#power-calendar-multiple onSelect=(action (mut collection) value="date") selected=collection center=center as |calendar|}}
        {{power-calendar-years/multiple publicAPI=(hash
          calendar=calendar
          format="YYYY"
          maxLength=1
        )}}
      {{/power-calendar-multiple}}
    `);

    await click('.ember-power-calendar-selector-year[data-date="2014"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2014"]').isNotDisabled();
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isDisabled();

    await click('.ember-power-calendar-selector-year[data-date="2014"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2014"]').isNotDisabled();
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isNotDisabled();
  });

  test('the maxLength property can handle changing of the property', async function(assert) {
    this.set('max', 1);
    this.set('center', center);

    await render(hbs`
      {{#power-calendar-multiple onSelect=(action (mut collection) value="date") selected=collection center=center as |calendar|}}
        {{power-calendar-years/multiple publicAPI=(hash
          calendar=calendar
          format="YYYY"
          maxLength=max
        )}}
      {{/power-calendar-multiple}}
    `);

    await click('.ember-power-calendar-selector-year[data-date="2014"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2014"]').isNotDisabled();
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isDisabled();

    this.set('max', 2);
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isNotDisabled();
  });

  test('maxLength can handle null for the selected years', async function(assert) {
    this.set('collection', null);
    this.set('center', center);

    await render(hbs`
      {{#power-calendar-multiple onSelect=(action (mut collection) value="date") selected=collection center=center as |calendar|}}
        {{power-calendar-years/multiple publicAPI=(hash
          calendar=calendar
          format="YYYY"
          maxLength=1
        )}}
      {{/power-calendar-multiple}}
    `);

    await click('.ember-power-calendar-selector-year[data-date="2015"]');
    this.set('collection', null);
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isNotDisabled();
  });

  test('maxLength can handle null for the maxLength property', async function(assert) {
    this.set('max', null);
    this.set('center', center);

    await render(hbs`
      {{#power-calendar-multiple onSelect=(action (mut collection) value="date") selected=collection center=center as |calendar|}}
        {{power-calendar-years/multiple publicAPI=(hash
          calendar=calendar
          format="YYYY"
          maxLength=max
        )}}
      {{/power-calendar-multiple}}
    `);

    await click('.ember-power-calendar-selector-year[data-date="2015"]');
    assert.dom('.ember-power-calendar-selector-year[data-date="2016"]').isNotDisabled();
    });
});
