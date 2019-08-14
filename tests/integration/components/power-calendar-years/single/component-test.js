import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let calendarService, calendar;
module('Integration | Component | power-calendar-years/single', function(hooks) {
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

    await render(hbs`{{power-calendar-years/single publicAPI=(hash calendar=calendar format="YYYY")}}`);
    assert.equal(
      this.get('element').textContent.replace(/\s+/g, ' ').trim(),
      '2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020',
    );
  });

  test('The format of the years can be changed passing `format="<format string>"`', async function(assert) {
    this.calendar = calendar;
    this.format = "YYYY";

    await render(hbs`{{power-calendar-years/single publicAPI=(hash calendar=calendar format=format) calendar=calendar}}`);
    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-year-grid').textContent.replace(/\s+/g, ' ').trim(),
      '2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020',
    );
    run(() => this.set('format', 'YY'));
    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-year-grid').textContent.replace(/\s+/g, ' ').trim(),
      '09 10 11 12 13 14 15 16 17 18 19 20',
    );
    run(() => this.set('format', 'YY MMM'));
    assert.equal(
      this.get('element').querySelector('.ember-power-calendar-selector-year-grid').textContent.replace(/\s+/g, ' ').trim(),
      '09 Jan 10 Jan 11 Jan 12 Jan 13 Jan 14 Jan 15 Jan 16 Jan 17 Jan 18 Jan 19 Jan 20 Jan',
    );
  });
});
