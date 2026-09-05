import { readFile, writeFile, access } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(resolve(root, path), 'utf8');
const product = JSON.parse(await read('data/product.json'));
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const safeUrl = (value) => {
  if (!/^(?:https:\/\/|assets\/)/.test(value)) throw new Error(`URL inválida: ${value}`);
  return escape(value);
};
const image = (asset, priority = false) => `<img src="${safeUrl(asset.src)}" alt="${escape(asset.alt)}" width="${asset.width}" height="${asset.height}" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
const lines = (value) => String(value).split(/ {2,}/).map(escape).join('<br>');
const sentenceCase = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
const list = (items) => items.map((item) => `<li>${escape(item)}</li>`).join('\n');
const heading = (id, title) => `<div class="section-head"><h2 id="${id}">${escape(title)}</h2></div>`;

for (const key of ['identity', 'hero', 'packageContents', 'keyPoints', 'applications', 'technicalData', 'assets']) {
  if (!product[key]) throw new Error(`Campo obrigatório ausente: ${key}`);
}
if (!Array.isArray(product.assets.gallery) || product.assets.gallery.length < 2) {
  throw new Error('A galeria precisa de pelo menos duas vistas.');
}
for (const asset of [product.assets.hero, product.assets.kit, product.assets.context, ...product.assets.gallery]) await access(resolve(root, asset.src));
if (product.packageContents.reduce((sum, item) => sum + item.qty, 0) !== product.packageTotal) {
  throw new Error('O total de itens não confere com o conteúdo da embalagem.');
}

const sections = {
  overview: `<section class="hero shell" id="visao-geral" aria-labelledby="product-name">
    <div class="hero-copy">
      <p class="eyebrow">${escape(product.identity.category)}</p>
      <h1 id="product-name">${escape(product.identity.name.replace(/\s+\S+$/, ''))} <span>${escape(product.identity.name.split(' ').at(-1))}</span></h1>
      <h2>${escape(sentenceCase(product.hero.headline))}</h2>
      <p class="lead">${escape(product.hero.description)}</p>
      <div class="badges"><span class="badge badge-accent">${escape(product.powerBadge)}</span><span class="badge">${escape(product.identity.process)}</span></div>
    </div>
    <figure class="hero-image${product.assets.hero.transparent ? ' is-transparent' : ' is-studio'}">${image(product.assets.hero, true)}</figure>
  </section>
  <section class="compliance" aria-label="Origem e conformidade">
    <div class="shell compliance-grid"><p>${escape(product.compliance.originPrimary)}</p><p>${escape(product.compliance.originSecondary)}</p><p>${escape(product.compliance.standard)}</p></div>
  </section>`,
  package: `<section class="shell section" id="conteudo" aria-labelledby="package-title">
    ${heading('package-title', 'Conteúdo da embalagem')}
    <div class="package-grid"><div class="product-gallery">
      <figure class="gallery-stage">${image(product.assets.gallery[0], true).replace('<img ', '<img data-gallery-image ')} </figure>
      <div class="gallery-thumbs" role="tablist" aria-label="Vistas do produto">${product.assets.gallery.map((asset, i) => `<button class="gallery-thumb${i === 0 ? ' is-selected' : ''}" type="button" role="tab" aria-selected="${i === 0}" aria-label="${escape(asset.label)}" data-gallery-src="${safeUrl(asset.src)}" data-gallery-alt="${escape(asset.alt)}" data-gallery-width="${asset.width}" data-gallery-height="${asset.height}"><img src="${safeUrl(asset.src)}" alt="" width="${asset.width}" height="${asset.height}" loading="lazy" decoding="async"></button>`).join('\n')}</div>
    </div><div>
      <ol class="package-list">${product.packageContents.map((item, i) => `<li><span class="item-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span>${escape(item.item)}</span><span class="quantity"><span class="sr-only">Quantidade: </span>${item.qty}</span></li>`).join('\n')}</ol>
      <p class="package-total">Total de Itens: <strong>${product.packageTotal}</strong></p>
      ${product.documents.manual ? `<a class="text-link" href="${safeUrl(product.documents.manual)}">Manual <span aria-hidden="true">↗</span></a>` : ''}
    </div></div>
  </section>`,
  features: `<section class="shell section features" id="recursos" aria-labelledby="features-title">
    ${heading('features-title', product.identity.name)}
    <ol class="feature-list">${product.keyPoints.map((item, i) => `<li><span class="item-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><p>${escape(item)}</p></li>`).join('\n')}</ol>
  </section>`,
  applications: `<section class="shell section applications" aria-labelledby="applications-title">
    ${heading('applications-title', 'Aplicações Principais')}
    <div class="application-grid">${product.applications.map((item, i) => `<article class="application"><span class="item-number" aria-hidden="true">0${i + 1}</span><h3>${escape(item)}</h3></article>`).join('\n')}</div>
  </section>`,
  technology: `<section class="technology" aria-labelledby="technology-title"><div class="shell technology-grid">
    <h2 id="technology-title">${escape(sentenceCase(product.secondaryHero))}</h2><figure>${image(product.assets.context)}</figure>
  </div></section>`,
  triad: `<section class="shell section" aria-label="Características, vantagens e benefícios"><div class="triad-grid">
    ${[['Características', 'characteristics'], ['Vantagens', 'advantages'], ['Benefícios', 'benefits']].map(([title, key], i) => `<article class="info-card${i === 2 ? ' accent-card' : ''}"><h2>${title}</h2><ul>${list(product[key])}</ul></article>`).join('\n')}
  </div></section>`,
  technical: `<section class="technical section" id="dados-tecnicos" aria-labelledby="tech-title"><div class="shell">
    <div class="section-head technical-head"><h2 id="tech-title">Dados Técnicos</h2><a class="text-link brochure-link" href="${safeUrl(product.documents.brochure)}"><svg class="brochure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.75h8.25L19 8.5v11.75H6z"/><path d="M14 3.75V9h5M9 13h7M9 16h5"/></svg><span>Folheto do produto</span><span aria-hidden="true">↗</span></a></div>
    <div class="table-scroll" role="region" aria-labelledby="tech-title" tabindex="0"><table><caption class="sr-only">Dados Técnicos — ${escape(product.identity.name)}</caption><thead><tr>${product.technicalData.columns.map((cell) => `<th scope="col">${escape(cell)}</th>`).join('')}</tr></thead><tbody>
    ${product.technicalData.rows.map(([label, mma, tig]) => `<tr><th scope="row">${escape(label)}</th>${label === 'Configurações Avançadas' && mma === tig ? `<td colspan="2">${lines(mma)}</td>` : `<td>${lines(mma)}</td><td>${lines(tig)}</td>`}</tr>`).join('\n')}
    </tbody></table></div>
  </div></section>`,
  related: `<section class="shell section" aria-labelledby="related-title">${heading('related-title', 'Conheça as outras linhas de produtos Denver')}<ul class="related-list">${list(product.relatedLines)}</ul></section>`,
};
const footer = `<footer id="contato"><div class="shell">
  <div class="footer-top"><a href="https://${escape(product.contact.website)}" aria-label="Denver Soldas — página inicial"><img class="brand-image" src="assets/denver-mark-dark.svg" alt="Denver Soldas" width="164" height="76" loading="lazy"></a><div><h2>${escape(product.contact.headline)}</h2><div class="phones">${product.contact.phones.split(' / ').map((phone) => `<a href="tel:+55${phone.replace(/\D/g, '')}">${escape(phone)}</a>`).join('')}</div></div></div>
  <div class="office-grid">${product.contact.offices.map((office) => `<address><h3>${escape(office.title)}</h3>${office.lines.map((line) => `<p>${escape(line)}</p>`).join('')}</address>`).join('\n')}</div>
  <div class="footer-bottom"><span>Denver Soldas Ltda.</span><a href="https://${escape(product.contact.website)}">${escape(product.contact.website)}</a></div>
</div></footer>`;

const template = await read('templates/page.html');
const html = template.replaceAll('{{TITLE}}', escape(`${product.identity.name} — Denver Soldas`))
  .replace('{{DESCRIPTION}}', escape(product.hero.description))
  .replace('{{CONTENT}}', Object.values(sections).join('\n\n'))
  .replace('{{FOOTER}}', footer);
await writeFile(resolve(root, 'index.html'), html);

// Both deliverables share the same generated markup; no second hand-maintained page.
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.webp': 'image/webp', '.pdf': 'application/pdf' };
const dataUrl = async (path) => `data:${mime[extname(path)]};base64,${(await readFile(resolve(root, path))).toString('base64')}`;
let fonts = await read('assets/fonts/fonts.css');
for (const [match, filename] of fonts.matchAll(/url\('\.\/([^']*)'\)/g)) fonts = fonts.replace(match, `url(${await dataUrl(`assets/fonts/${filename}`)})`);
let standalone = html.replace('<link rel="stylesheet" href="assets/fonts/fonts.css">', `<style>${fonts}</style>`)
  .replace('<link rel="stylesheet" href="styles.css">', `<style>${await read('styles.css')}</style>`);
for (const [match, attr, path] of standalone.matchAll(/(src|href)="(assets\/[^"#]+)"/g)) {
  standalone = standalone.replace(match, `${attr}="${await dataUrl(path)}"`);
}
standalone = standalone.replace('<script src="gallery.js" defer></script>', `<script>${await read('gallery.js')}</script>`);
await writeFile(resolve(root, 'standalone.html'), standalone);
console.log('Generated index.html and standalone.html from data/product.json.');
