import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
//import { setupMockData } from './-mock-data';

module('Unit | Service | address-register', function (hooks) {
  setupTest(hooks);
  //setupMockData(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:address-register');
    assert.ok(service);
  });

  test("suggest returns falsy if we don't set the service up first", async function (assert) {
    let service = this.owner.lookup('service:address-register');
    const result = await service.suggest('test');
    assert.notOk(result, 'should be null');
  });

  test('suggest returns addresses', async function (assert) {
    let service = this.owner.lookup('service:address-register');
    service.setup({ endpoint: '/test-endpoint' });

    const result = await service.suggest('test');

    assert.strictEqual(result.length, 3, 'we get 3 suggestions');
  });

  test('suggest unvalid address returns empty result', async function (assert) {
    let service = this.owner.lookup('service:address-register');
    service.setup({ endpoint: '/test-endpoint' });

    const result = await service.suggest('unvalid address');

    assert.strictEqual(result.length, 0, 'we get 0 suggestions');
  });

  test("find all returns falsy if we don't set the service up first", async function (assert) {
    let service = this.owner.lookup('service:address-register');
    const address = {
      id: 123,
      street: 'street',
      housenumber: 22,
      zipCode: 1000,
      municipality: 'municipality',
      fullAddress: 'street 22, 1000 municipality',
    };
    const result = await service.findAll(address);
    assert.notOk(result, 'should be null');
  });

  test('find all returns addresses when given a suggestion', async function (assert) {
    let service = this.owner.lookup('service:address-register');
    service.setup({ endpoint: '/test-endpoint' });
    const suggestion = {
      id: 123,
      street: 'street',
      housenumber: 22,
      zipCode: 1000,
      municipality: 'municipality',
      fullAddress: 'street 22, 1000 municipality',
    };
    const result = await service.findAll(suggestion);

    assert.strictEqual(result.length, 1, 'we get 1 address');
  });

  test('find all returns empty result when given empty suggestion', async function (assert) {
    let service = this.owner.lookup('service:address-register');
    service.setup({ endpoint: '/test-endpoint' });

    const result = await service.findAll(null);

    assert.strictEqual(result.length, 0, 'we get 0 address');
  });

  test('address is empty', function (assert) {
    let service = this.owner.lookup('service:address-register');

    const emptyAddress = {};
    const address = {
      id: 123,
      street: 'street',
      housenumber: 22,
      zipCode: 1000,
      municipality: 'municipality',
      fullAddress: 'street 22, 1000 municipality',
    };

    assert.ok(service.isEmpty(emptyAddress), 'empty address is declared empty');
    assert.notOk(
      service.isEmpty(address),
      'filled address is declared not empty'
    );
  });
});
