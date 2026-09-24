'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('疑似访客界面展示原因与信号，并支持永久处置和全站规则', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'public', 'admin.html'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'public', 'admin.js'), 'utf8');
  const storage = fs.readFileSync(path.join(root, 'src', 'services', 'StorageService.js'), 'utf8');
  const migration = fs.readFileSync(path.join(root, 'migrations', '001_initial.sql'), 'utf8');

  assert.match(html, /详细原因[\s\S]+风险信号/);
  assert.match(html, /suspect-permanent[\s\S]+永久处置/);
  assert.match(html, /suspect-apply-all-sites[\s\S]+所有站点/);
  assert.match(html, /suspect-rule-signal/);
  assert.match(script, /installManualRuleControls/);
  assert.match(script, /manual-rule-type[\s\S]+访客身份/);
  assert.match(script, /manual-rule-validity[\s\S]+永久/);
  assert.match(script, /scoreImpact[\s\S]+signalLabel/);
  assert.match(script, /signalExplanations[\s\S]+为什么可疑|signalExplanations[\s\S]+更像脚本/);
  assert.match(script, /dataCopySignal|copySignal/);
  assert.match(script, /applyToAllSites[\s\S]+ruleSignal/);
  assert.match(script, /siteKey: \$\('manual-rule-site'\)\.value/);
  assert.match(storage, /site_key = \$1 OR site_key = '\*'/);
  assert.match(storage, /expires_at IS NULL OR expires_at > NOW\(\)/);
  assert.match(storage, /create_signal_rule_from_visitor/);
  assert.match(storage, /latestEvidence/);
  assert.match(migration, /ALTER TABLE manual_overrides ALTER COLUMN expires_at DROP NOT NULL/);
  assert.match(migration, /ALTER TABLE signal_rules ALTER COLUMN duration_minutes DROP NOT NULL/);
});
