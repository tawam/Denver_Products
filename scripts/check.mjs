import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const html = await read('index.html');
const standalone = await read('standalone.html');
const product = JSON.parse(await read('data/product.json'));
const body = (source) => source.match(/<body>([\s\S]*)<\/body>/)[1];
const text = (source) => body(source).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
assert.equal(text(html), text(standalone), 'As duas páginas devem ter o mesmo conteúdo.');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Uma única identificação principal.');
assert((html.match(/<script\b/g) || []).length === 1 && html.includes('gallery.js'), 'A página deve usar apenas o script essencial da galeria.');
assert(!/MASTER PAGE|informação do folheto|sem ruído visual|\bASSET\b/.test(html), 'Texto interno visível.');
for (const [attribute, path] of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((match) => [match[0], match[1]])) {
  if (!/^(https?:|tel:)/.test(path)) await access(new URL(path, root));
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs duplicados.');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), `Âncora ausente: ${id}`);
for (const value of [...product.keyPoints, ...product.characteristics, ...product.advantages, ...product.benefits, ...product.applications, ...product.relatedLines]) {
  assert(text(html).includes(value), `Informação ausente: ${value}`);
}
const rows = [...html.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)][0][1].match(/<tr>/g);
assert.equal(rows.length, product.technicalData.rows.length, 'Linhas da tabela incompletas.');
for (const row of product.technicalData.rows) {
  for (const value of row) assert(text(html).includes(value.replace(/\s+/g, ' ')), `Dado técnico divergente: ${value}`);
}
assert(!/(?:src|href)="assets\//.test(standalone), 'Dependência local no standalone.');
assert(!/url\(['"]?\.\//.test(standalone), 'Fonte local no standalone.');
assert.equal(product.packageTotal, product.packageContents.reduce((sum, item) => sum + item.qty, 0));
console.log('OK: conteúdo, tabela, arquivos, âncoras e equivalência do standalone.');
