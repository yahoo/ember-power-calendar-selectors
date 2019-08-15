import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let calendarService, calendar;
module('Integration | Component | power-calendar-months', function(hooks) {
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
      type: 'single',
    };
  });

  test('it renders', async function(assert) {
    this.set('calendar', calendar);

    await render(hbs`{{power-calendar-months calendar=calendar}}`);
    assert.equal(
      this.get('element').textContent.replace(/\s+/g, ' ').trim(),
      'Q1 Q2 Q3 Q4 Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec',
    );
  });
});
