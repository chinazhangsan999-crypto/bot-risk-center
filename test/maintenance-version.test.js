'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { compareSemver, evaluateMaintenanceVersion, sourceForProject } = require('../src/services/MaintenanceVersionService');

test('only a newer semantic version is an available update', () => {
  assert.equal(compareSemver('8.23.0', '7.14.0'), 1);
  assert.equal(compareSemver('3.1137.0', '3.1139.0'), -1);
  assert.equal(compareSemver('17-alpine', '17.0.0'), null);
  assert.equal(evaluateMaintenanceVersion({ projectKey: 'node-postgres', installedVersion: '8.23.0' }, { version: '7.14.0', source: 'npm' }), 'version_ahead');
  assert.equal(evaluateMaintenanceVersion({ projectKey: 'aws-route53-sdk', installedVersion: '3.1137.0' }, { version: '3.1139.0', source: 'npm' }), 'update_available');
});

test('references and runtime inventories never become update alerts without comparable versions', () => {
  assert.equal(evaluateMaintenanceVersion({ projectKey: 'anubis', integrationMode: 'reference' }, { version: '1.27.0', source: 'reference' }), 'reference');
  assert.equal(evaluateMaintenanceVersion({ projectKey: 'cloudflare-workerd', installedVersion: 'cloudflare-managed' }, { source: 'runtime_inventory' }), 'managed');
  assert.equal(evaluateMaintenanceVersion({ projectKey: 'caddy', installedVersion: '' }, { source: 'runtime_inventory' }), 'untracked');
  assert.equal(evaluateMaintenanceVersion({ projectKey: 'postgresql', installedVersion: '17-alpine' }, { source: 'runtime_inventory' }), 'unverifiable');
  assert.deepEqual(sourceForProject({ projectKey: 'node-postgres', integrationMode: 'direct' }), { kind: 'npm', packageName: 'pg' });
});
