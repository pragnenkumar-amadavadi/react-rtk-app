import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type: string;
}

const indexPath = path.resolve(import.meta.dirname, '../storybook-static/index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as { entries: Record<string, StoryEntry> };
const stories = Object.values(index.entries).filter((entry) => entry.type === 'story');

for (const story of stories) {
  test(`${story.title} / ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    // MUI Dialogs portal outside #storybook-root, so wait on Storybook's own
    // "story finished mounting" signal rather than that element's visibility.
    await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
    await expect(page).toHaveScreenshot(`${story.id}.png`);
  });
}
