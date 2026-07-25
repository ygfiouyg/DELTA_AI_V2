#!/usr/bin/env node
/**
 * test_deep_installer.ts — V.65 Validation
 * يختبر الـ deep skill installer
 */

import { installSkillDeep } from '../src/lib/deep-skill-installer';

async function testDeepInstaller() {
  console.log('═══ DeltaAI V.65 Deep Skill Installer Test ═══\n');

  // Test: Install a skill with full directory cloning
  console.log('[Test] Deep installing skill from GitHub...\n');

  const result = await installSkillDeep(
    'test skill',
    'https://github.com/skillsgate/skillsgate/tree/main/packages/cli/test-skill',
    (progress) => {
      console.log(`  [${progress.progress}%] ${progress.step}: ${progress.message}${progress.details ? ' (' + progress.details + ')' : ''}`);
    }
  );

  console.log('\n═══ Results ═══');
  console.log(`Success: ${result.success ? '✅' : '❌'}`);
  console.log(`Message: ${result.message}`);
  console.log(`Skill: ${result.skillName}`);
  console.log(`Files downloaded: ${result.files.length}`);
  console.log(`Scripts registered: ${result.scripts.length}`);

  if (result.files.length > 0) {
    console.log('\nFiles:');
    for (const f of result.files) {
      const icon = f.type === 'skill' ? '📄' : f.type === 'script' ? '⚙️' : f.type === 'asset' ? '🖼️' : '📚';
      const exec = f.executable ? ' [executable]' : '';
      console.log(`  ${icon} ${f.path} (${f.size} bytes${exec})`);
    }
  }

  if (result.scripts.length > 0) {
    console.log('\nRegistered Scripts (MCP):');
    for (const s of result.scripts) {
      console.log(`  ⚙️  ${s}`);
    }
  }

  console.log('\n═══ Progress Log ═══');
  for (const p of result.progress) {
    console.log(`  [${p.progress}%] ${p.step}: ${p.message}`);
  }

  if (result.success) {
    console.log('\n[SUCCESS] Deep installer is working — full directory cloned');
  } else {
    console.log('\n[PARTIAL] Installation completed with issues');
  }
}

testDeepInstaller().catch(e => {
  console.error('[FAILED]', e);
  process.exit(1);
});
