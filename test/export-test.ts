import assert from 'node:assert';
import mukProp, { mukProp as namedMukProp } from '..';

describe('Exports', () => {
  it('Exposes function as default and named export', () => {
    assert.strictEqual(mukProp, namedMukProp);
    assert.strictEqual(mukProp.mukProp, mukProp);
    assert.strictEqual(mukProp.default, mukProp);
  });
});
