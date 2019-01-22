import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from 'dummy/tests/assertions';

let calendarService, calendar;
module('Integration | Component | power-calendar-months/range', function(hooks) {
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
      }
    };
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('it renders', async function(assert) {
    this.set('calendar', calendar);

    await render(hbs`
      {{power-calendar-months/range 
        publicAPI=(hash calendar=calendar format="MMM" firstQuarter=1 showQuarters=true) 
      }}`
    );

    assert.equal(
      this.element.textContent.replace(/\s+/g, ' ').trim(), 
      'Q1 Q2 Q3 Q4 Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'
    );
  });
});
