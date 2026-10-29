import { expect, test } from '@playwright/test';
import path from 'node:path';

test('resume copy and existing accordions @smoke', async ({ page }, testInfo) => {
  await page.route('https://api.github.com/**', route => route.fulfill({ json: [] }));
  await page.goto('/');
  await expect(page).toHaveTitle(/AI Implementation & Full-Stack Developer/);
  await expect(page.getByRole('heading', { name: /AI implementation and full-stack developer/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('hero.png'), fullPage: false });
  for (const title of ['I H8 PDFs', 'Regulator', 'Feeds', 'IOA Digital', 'BKL Consultants']) {
    const trigger = page.getByRole('button', { name: new RegExp(title) });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`);
    await expect(panel).toBeVisible();
    if (title === 'IOA Digital') {
      for (const text of ['Blue Pearl Mortgage Group CRM', 'Oakhart Design & Construction', 'TCAT Metal Recycler', 'The Contractor Consultants']) {
        await expect(panel.getByRole('heading', { name: text })).toBeVisible();
      }
      await expect(panel).toContainText('3,400+ calls daily');
      await expect(panel).toContainText('98% match rate against verified reference data');
      await expect(panel).toContainText('Retell AI voice agent demonstration');
      await expect(panel).toContainText('88%');
    }
    if (title === 'BKL Consultants') {
      await expect(panel).toContainText('99.9% uptime');
      await expect(panel).toContainText('over 8 hours');
    }
    await page.waitForTimeout(350);
    const overflow = await panel.evaluate(el => Array.from(el.querySelectorAll('p, li, h6, span')).filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && (rect.right > window.innerWidth + 1 || rect.left < -1 || node.scrollWidth > node.clientWidth + 1);
    }).map(node => node.textContent));
    expect(overflow).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${title.replaceAll(' ', '-')}.png`), fullPage: true });
    if (process.env.PORTFOLIO_PROOF_DIR) {
      await panel.screenshot({ path: path.join(process.env.PORTFOLIO_PROOF_DIR, `${testInfo.project.name}-${title.replaceAll(' ', '-')}.png`) });
    }
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
  await expect(page.getByRole('button', { name: /Kiuloper/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Ubineer/ })).toBeVisible();
});
