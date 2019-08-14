import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | private-let', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{private-let}}`);
    assert.equal(
      this.element.textContent.trim(),
      '',
      'it renders totally empty when nothing is provided',
    );

    await render(hbs`
      {{#private-let
        "a_string"
        (hash dog="cat")
        false
        as | str obj falsy |
      }}
        {{str}}
        {{obj.dog}}
        {{falsy}}
      {{/private-let}}
    `);

    assert.equal(
      this.element.textContent.trim().replace(/\s+/g, ' '),
      'a_string cat false',
      'when passed positional props they are yeilded back, including falsy values.',
    );
  });
});
