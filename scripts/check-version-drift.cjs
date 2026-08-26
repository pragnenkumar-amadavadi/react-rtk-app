#!/usr/bin/env node
'use strict';

// Fails (exit 1) if any dependency is pinned to different version ranges
// across the workspace's package.json files. Walks apps/* and packages/*
// directly so newly added workspace packages are covered automatically.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function findWorkspacePackageJsons() {
  const paths = [path.join(ROOT, 'package.json')];
  for (const group of ['apps', 'packages']) {
    const groupDir = path.join(ROOT, group);
    if (!fs.existsSync(groupDir)) continue;
    for (const entry of fs.readdirSync(groupDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const pkgJsonPath = path.join(groupDir, entry.name, 'package.json');
      if (fs.existsSync(pkgJsonPath)) paths.push(pkgJsonPath);
    }
  }
  return paths;
}

function collectVersions(pkgJsonPaths) {
  const versions = new Map(); // depName -> Map<version, Set<packageName>>

  for (const pkgJsonPath of pkgJsonPaths) {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    const fields = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };

    for (const [dep, version] of Object.entries(fields)) {
      if (version.startsWith('workspace:')) continue; // internal refs always resolve locally

      if (!versions.has(dep)) versions.set(dep, new Map());
      const byVersion = versions.get(dep);
      if (!byVersion.has(version)) byVersion.set(version, new Set());
      byVersion.get(version).add(pkg.name);
    }
  }

  return versions;
}

function main() {
  const pkgJsonPaths = findWorkspacePackageJsons();
  const versions = collectVersions(pkgJsonPaths);
  const drifted = [...versions.entries()].filter(([, byVersion]) => byVersion.size > 1);

  if (drifted.length === 0) {
    console.log(
      `✓ No version drift across ${pkgJsonPaths.length} package.json files (${versions.size} shared dependencies checked).`,
    );
    return;
  }

  console.error(
    `✗ Version drift found in ${drifted.length} dependenc${drifted.length === 1 ? 'y' : 'ies'}:\n`,
  );
  for (const [dep, byVersion] of drifted) {
    console.error(`  ${dep}`);
    for (const [version, pkgNames] of byVersion) {
      console.error(`    ${version}  ->  ${[...pkgNames].join(', ')}`);
    }
    console.error('');
  }
  console.error('Pin these to the same version range across every package.json before merging.');
  process.exitCode = 1;
}

main();
