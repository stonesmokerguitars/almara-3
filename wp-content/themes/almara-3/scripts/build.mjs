import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import config from '../site.config.mjs';
import { services } from '../src/services.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'src/home.html'), 'utf8');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const origin = config.siteUrl.replace(/\/$/, '');
if (!/^https:\/\//.test(origin)) throw new Error('siteUrl must be the final HTTPS website origin.');
const absolute = path => origin + '/' + path;
const icon = name => '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
const button = (text, href, variant = 'primary') => '<a class="button button-' + variant + '" href="' + escape(href) + '">' + text + ' ' + icon('arrow') + '</a>';
const link = (text, href) => '<a class="text-link" href="' + escape(href) + '">' + text + ' ' + icon('arrow') + '</a>';
const section = (className) => {
  const value = source.match(new RegExp('<section class="' + className + '[\\s\\S]*?<\\/section>'));
  if (!value) throw new Error('Missing source section: ' + className);
  return value[0];
};
const sprite = source.match(/  <svg class="icon-library"[\s\S]*?<\/svg>/)[0];
const headerTemplate = source.match(/  <header class="site-header">[\s\S]*?<\/header>/)[0]
  .replace('<a class="nav-link" href="o-nas/">', '<a class="nav-link" href="jak-pracujeme/">Jak pracujeme</a>\n        <a class="nav-link" href="o-nas/">');
const footerTemplate = source.match(/  <footer class="site-footer">[\s\S]*?<\/footer>/)[0];
const lightbox = source.match(/  <dialog class="lightbox"[\s\S]*?<\/dialog>/)[0];
const inquiry = source.match(/<form class="inquiry-form[\s\S]*?<\/form>/)[0]
  .replace(/<select id="type" name="type">[\s\S]*?<\/select>/, '<select id="type" name="type"><option value="">Vyberte typ projektu</option>' + services.map(s => '<option>' + s.title + '</option>').join('') + '<option>Jiný projekt</option></select>');
const contactCopy = source.match(/<div class="contact-copy[\s\S]*?<\/div>\s*<form/)[0].replace(/\s*<form$/, '');
const pages = [];
const breadcrumbs = items => '<nav class="shell breadcrumbs" aria-label="Drobečková navigace"><ol><li><a href="./">Domů</a></li>' + items.map((item, index) => '<li>' + (index === items.length - 1 ? '<span aria-current="page">' + escape(item.name) + '</span>' : '<a href="' + item.path + '">' + escape(item.name) + '</a>') + '</li>').join('') + '</ol></nav>';
const pageIntro = (eyebrow, headline, lead) => '<section class="page-intro shell" id="top"><p class="eyebrow hero-enter">' + eyebrow + '</p><h1 class="hero-enter">' + headline + '</h1><p class="page-lead hero-enter">' + lead + '</p></section>';
const banner = (title = 'Proměňme vaši představu<br><em>ve skutečnost.</em>', href = 'poptavka/') => '<section class="contact-banner"><img src="assets/images/hero-kuchyne.webp" width="1672" height="941" loading="lazy" alt="" data-parallax="24"><div class="banner-shade"></div><div class="shell banner-inner"><div class="reveal"><p class="eyebrow">Váš interiér. Naše řemeslo.</p><h2>' + title + '</h2><p>Stačí nám napsat. Společně najdeme řešení pro váš prostor.</p></div>' + button('Nezávazně poptat', href, 'light') + '</div></section>';
const serviceCard = (service, index) => '<a class="service-card reveal" href="' + service.slug + '/" style="--delay:' + index % 3 * 80 + 'ms"><div class="service-image"><img src="assets/images/' + service.image + '" alt="' + escape(service.title + ' — inspirace a materiály') + '" width="1440" height="960" loading="lazy"><span class="service-number">' + String(index + 1).padStart(2, '0') + ' /</span><span class="service-hover">Objevte možnosti pro váš prostor</span></div><div class="service-label"><h3>' + service.title + '</h3><span class="card-arrow">' + icon('arrow') + '</span></div></a>';
const faqSection = (title, entries) => '<section class="faq section"><div class="shell faq-grid"><div class="reveal"><p class="eyebrow">Praktické otázky</p><h2>' + title + '</h2><p>Každý prostor je jiný.<br>Konkrétní možnosti rádi probereme.</p>' + link('Zeptejte se nás', 'kontakt/') + '</div><div class="faq-list reveal">' + entries.map(([q,a]) => '<details class="accordion"><summary>' + escape(q) + icon('plus') + '</summary><div class="accordion-body"><p>' + escape(a) + '</p></div></details>').join('') + '</div></div></section>';
const miniProcess = () => '<section class="section section-tinted"><div class="shell"><div class="section-heading reveal"><div><p class="eyebrow">Od návrhu po montáž</p><h2>Jeden partner.<br><em>Celá cesta k vašemu interiéru.</em></h2></div>' + link('Jak pracujeme', 'jak-pracujeme/') + '</div><ol class="mini-process"><li><span>01</span><h3>Probereme představu</h3><p>Prostor, potřeby, materiály i rozpočet.</p></li><li><span>02</span><h3>Doladíme návrh</h3><p>Přesné rozměry, detaily a cenová nabídka.</p></li><li><span>03</span><h3>Vyrobíme na míru</h3><p>Zakázkové zpracování podle odsouhlaseného řešení.</p></li><li><span>04</span><h3>Přivezeme a namontujeme</h3><p>Pečlivé sestavení a společné předání.</p></li></ol></div></section>';
const schema = (meta) => {
  const url = absolute(meta.path);
  const org = { '@type': 'Organization', '@id': absolute('#organization'), name: config.legalName, url: origin + '/', logo: absolute('assets/images/logo-almara-modern.svg'), email: config.email };
  const graph = [org, { '@type': meta.type || 'WebPage', '@id': url + '#page', url, name: meta.title, description: meta.description, inLanguage: 'cs-CZ', isPartOf: { '@id': absolute('#website') }, about: { '@id': absolute('#organization') } }];
  if (!meta.path) graph.push({ '@type':'WebSite', '@id':absolute('#website'), url:origin + '/', name:config.name, inLanguage:'cs-CZ', publisher:{'@id':absolute('#organization')} });
  if (meta.breadcrumbs?.length) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type':'ListItem', position:1, name:'Domů', item:origin + '/' }, ...meta.breadcrumbs.map((item,index) => ({ '@type':'ListItem', position:index + 2, name:item.name, item:absolute(item.path) }))] });
  if (meta.service) graph.push({ '@type':'Service', '@id':url + '#service', name:meta.service.title, serviceType:meta.service.title, description:meta.description, url, provider:{'@id':absolute('#organization')}, areaServed:{'@type':'City', name:'Teplice'} });
  return JSON.stringify({ '@context':'https://schema.org', '@graph':graph }).replaceAll('<','\\u003c');
};
const head = meta => '<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <meta name="theme-color" content="#f8f6f2">\n  <title>' + escape(meta.title) + '</title>\n  <meta name="description" content="' + escape(meta.description) + '">\n  <link rel="canonical" href="' + absolute(meta.path) + '">\n  <meta property="og:type" content="website">\n  <meta property="og:locale" content="cs_CZ">\n  <meta property="og:site_name" content="Almara-3">\n  <meta property="og:title" content="' + escape(meta.title) + '">\n  <meta property="og:description" content="' + escape(meta.description) + '">\n  <meta property="og:url" content="' + absolute(meta.path) + '">\n  <meta property="og:image" content="' + absolute('assets/images/' + (meta.image || 'hero-kuchyne.webp')) + '">\n  <meta property="og:image:alt" content="' + escape(meta.imageAlt || meta.title) + '">\n  <meta name="twitter:card" content="summary_large_image">\n  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&amp;family=DM+Serif+Display:ital@0;1&amp;display=swap" rel="stylesheet">\n  <link rel="preload" as="image" href="assets/images/' + (meta.image || 'hero-kuchyne.webp') + '" fetchpriority="high">\n  <link rel="stylesheet" href="styles.css">\n  <script src="script.js" defer></script>\n  <script type="application/ld+json">' + schema(meta) + '</script>\n</head>';
const footerDirectory = '<div class="shell footer-directory"><div><h3>Pro váš domov</h3>' + services.filter(s=>s.group==='Domov').slice(0,5).map(s=>'<a href="' + s.slug + '/">' + s.title + '</a>').join('') + '</div><div><h3>Další nábytek na míru</h3>' + services.filter(s=>s.group==='Domov').slice(5).map(s=>'<a href="' + s.slug + '/">' + s.title + '</a>').join('') + '</div><div><h3>Pro firmy a atypické prostory</h3>' + services.filter(s=>s.group!=='Domov').map(s=>'<a href="' + s.slug + '/">' + s.title + '</a>').join('') + '</div><div><h3>Společně od prvního kroku</h3><a href="jak-pracujeme/">Jak pracujeme</a><a href="o-nas/">O truhlářství Almara-3</a><a href="realizace/">Inspirace pro váš interiér</a><a href="kontakt/">Kontakt</a><a href="poptavka/">Nezávazná poptávka</a></div></div>';
const footer = footerTemplate.replace('<div class="shell footer-bottom">', footerDirectory + '\n    <div class="shell footer-bottom">');
const prefixPaths = (html, depth) => {
  if (!depth) return html;
  const prefix = '../'.repeat(depth);
  return html.replace(/(href|src)="([^"]*)"/g, (full, attribute, value) => {
    if (!value || /^(#|https?:|mailto:|tel:|data:)/.test(value)) return full;
    return attribute + '="' + (value === './' ? prefix : prefix + value) + '"';
  });
};
const render = (meta, content, dialogs = '') => {
  let header = headerTemplate.replace('class="nav-link active"', 'class="nav-link"').replace(' aria-current="page"', '');
  const active = meta.active || (meta.service ? 'sluzby/' : meta.path || './');
  header = header.replace('class="nav-link" href="' + active + '"', 'class="nav-link active" href="' + active + '" aria-current="page"');
  const html = '<!doctype html>\n<html lang="cs">\n' + head(meta) + '\n<body class="' + (meta.bodyClass || '') + '">\n  <a class="skip-link" href="#main">Přejít na obsah</a>\n' + sprite + '\n' + header + '\n  <main id="main">' + content + '</main>\n' + footer + '\n' + dialogs + '\n</body>\n</html>\n';
  return prefixPaths(html, meta.path.split('/').filter(Boolean).length);
};
const savePage = async (meta, content, dialogs) => {
  const file = resolve(root, meta.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  const html = render(meta, content, dialogs);
  let previous = '';
  try { previous = await readFile(file, 'utf8'); } catch {}
  if (html !== previous) await writeFile(file, html);
  pages.push(meta);
};

// Homepage is the visual overview, all navigation and service cards lead to pages.
let homeMain = source.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
homeMain = homeMain.replace(/<section class="contact section[\s\S]*?<\/section>/, '<section class="section home-contact"><div class="shell home-contact-inner reveal"><div><p class="eyebrow">Začněme rozhovorem</p><h2>Každý dobrý projekt<br><em>začíná u vás.</em></h2></div><div><p>Máte jasný plán, nebo zatím jen nápad?<br>Napište nám. První krok je nezávazný.</p>' + button('Povězte nám o projektu', 'poptavka/') + link('Kontaktní údaje', 'kontakt/') + '</div></div></section>');
await savePage({path:'', title:'Nábytek na míru Teplice | Truhlářství Almara-3', description:'Kuchyně, vestavěné skříně a nábytek na míru v Teplicích a okolí. Almara-3 spojuje poctivé řemeslo, promyšlený design a pečlivou montáž.'}, homeMain, lightbox);

for (const service of services) {
  const path = service.slug + '/';
  const trail = [{name:'Služby',path:'sluzby/'},{name:service.title,path}];
  const inquiryHref = 'poptavka/?sluzba=' + encodeURIComponent(service.title);
  const content = breadcrumbs(trail) +
    '<section class="shell page-hero" id="top"><div class="page-hero-copy"><p class="eyebrow hero-enter">Na míru vašemu prostoru · Teplice a okolí</p><h1 class="hero-enter">' + service.headline + '</h1><p class="page-lead hero-enter">' + service.lead + '</p><div class="page-hero-actions hero-enter">' + button('Nezávazně poptat', inquiryHref) + link('Jak spolupracujeme', 'jak-pracujeme/') + '</div><div class="page-hero-note">' + icon('ruler') + '<span>Zaměření. Návrh. Výroba. Montáž.</span></div></div><div class="page-hero-visual hero-enter"><img src="assets/images/' + service.image + '" alt="' + escape(service.title + ' — inspirace pro váš interiér') + '" width="1440" height="1100" fetchpriority="high"><span>INSPIRACE & ŘEMESLO</span></div></section>' +
    '<section class="section"><div class="shell service-intro"><div class="reveal"><p class="eyebrow">Navrženo pro každý den</p><h2>' + service.introTitle + '</h2></div><div class="prose reveal">' + service.paragraphs.map(p=>'<p>' + p + '</p>').join('') + '</div></div><div class="shell detail-grid service-features">' + service.features.map(([title,text],i)=>'<article class="detail-card reveal" style="--delay:' + i*90 + 'ms">' + icon(['plan','leaf','craft'][i]) + '<span class="detail-number">0' + (i+1) + '</span><h3>' + title + '</h3><p>' + text + '</p></article>').join('') + '</div></section>' +
    '<section class="section service-options section-tinted"><div class="shell service-intro"><div class="reveal"><p class="eyebrow">Možnosti provedení</p><h2>Váš prostor.<br><em>Vaše možnosti.</em></h2><p class="section-subtext">Konkrétní rozměry, materiály a vybavení spolu vybereme podle vašeho zadání.</p></div><ul class="scope-list reveal">' + service.options.map(o=>'<li>' + icon('check') + escape(o) + '</li>').join('') + '</ul></div></section>' +
    faqSection('Co vás může<br><em>zajímat.</em>',service.faqs) + miniProcess() +
    '<section class="section"><div class="shell"><div class="section-heading reveal"><div><p class="eyebrow">Domov v souvislostech</p><h2>Mohlo by vás<br><em>také zajímat.</em></h2></div>' + link('Všechny služby', 'sluzby/') + '</div><div class="service-grid">' + service.related.map((slug,index)=>serviceCard(services.find(s=>s.slug===slug),index)).join('') + '</div></div></section>' +
    banner('Pojďme dát vašemu<br>prostoru <em>nový tvar.</em>',inquiryHref);
  await savePage({path,title:service.title + ' Teplice | Almara-3',description:service.meta,breadcrumbs:trail,service,image:service.image,bodyClass:'service-page'},content);
}

const servicesTrail = [{name:'Služby',path:'sluzby/'}];
const catalogue = breadcrumbs(servicesTrail) + pageIntro('Co pro vás můžeme vytvořit','Pro každý prostor.<br><em>Přesně pro vás.</em>','Od kuchyně až po poslední polici. Objevte možnosti zakázkové výroby pro váš domov, kancelář nebo provozovnu.') +
  '<section class="section catalog-section"><div class="shell"><div class="service-grid">' + services.slice(0,6).map(serviceCard).join('') + '</div><div class="catalog-more"><div class="section-heading reveal"><div><p class="eyebrow">Další možnosti</p><h2>Každé místo<br><em>má svůj potenciál.</em></h2></div></div><div class="catalog-list">' + services.slice(6).map((s,i)=>'<a class="catalog-item reveal" href="' + s.slug + '/"><span class="catalog-index">' + String(i+7).padStart(2,'0') + '</span><div><h3>' + s.title + '</h3><p>' + s.lead + '</p></div>' + icon('up-right') + '</a>').join('') + '</div></div></div></section>' + miniProcess() + banner();
await savePage({path:'sluzby/',title:'Truhlářské služby a nábytek na míru | Almara-3 Teplice',description:'Přehled služeb Almara-3: kuchyně, skříně, šatny, obývací pokoje, koupelny, kanceláře, dveře a atypický nábytek na míru v Teplicích.',breadcrumbs:servicesTrail},catalogue);

const aboutTrail = [{name:'O nás',path:'o-nas/'}];
await savePage({path:'o-nas/',title:'O nás | Truhlářství Almara-3, Teplice',description:'Poznejte truhlářství Almara-3. Zakázkový nábytek s důrazem na skutečné potřeby, kvalitní materiály a pečlivé zpracování od návrhu po montáž.',breadcrumbs:aboutTrail,type:'AboutPage',image:'dilna.webp'},breadcrumbs(aboutTrail) + pageIntro('Almara-3 · Truhlářství na míru','Poctivá práce.<br><em>Osobní přístup.</em>','Máme rádi dřevo, promyšlené detaily a prostory, ve kterých se dobře žije. Každá zakázka pro nás začíná tím, že vám nasloucháme.') + section('about section') + section('benefits') + '<section class="section"><div class="shell editorial-grid"><div class="reveal"><p class="eyebrow">Jak o své práci přemýšlíme</p><h2>Nábytek pro život.<br><em>Nejen pro fotografii.</em></h2></div><div class="prose reveal"><p>Každý interiér má jiný rytmus. Rodina potřebuje jiné úložné prostory než člověk, který pracuje z domova. Právě proto se ptáme na běžný den, na věci, které používáte, i na detaily, které vám dnes nevyhovují.</p><p>V návrhu propojujeme vzhled s konstrukcí a praktickým používáním. Řešíme, jak se otevírá zásuvka, kam vede kabel, jak se čistí povrch i kolik místa zbývá kolem nábytku. Materiály vybíráme v souvislosti s konkrétním účelem a rozpočtem.</p><p>Působíme v Teplicích a okolí. Naším cílem je srozumitelná spolupráce, ve které víte, co se připravuje a co následuje. Od první konzultace po předání hotového nábytku.</p>' + link('Prohlédnout naše služby','sluzby/') + '</div></div></section>' + section('details-section section') + banner());

const processTrail = [{name:'Jak pracujeme',path:'jak-pracujeme/'}];
const processSteps = [
  ['Konzultace a zaměření','Nejdřív poznáme váš prostor.','Pošlete nám představu, fotografie nebo přibližné rozměry. Probereme, co potřebujete, jaký máte rozpočet a co pro vás bude při používání důležité. Při zaměření ověříme dispozici, návaznosti i případná omezení.','Vaše zadání, lokalita a první představa.','people'],
  ['Návrh a cenová nabídka','Každý detail má své místo.','Připravíme konkrétní řešení: rozměry, členění, materiály a kování. Společně projdeme vzhled i fungování nábytku. Na základě návrhu vznikne cenová nabídka a domluvíme podmínky i předpokládaný harmonogram.','Odsouhlasený návrh, materiály a rozsah dodávky.','plan'],
  ['Zakázková výroba','Vaše představa dostává tvar.','Výroba navazuje na schválené podklady. Při zpracování hlídáme rozměry, návaznost dílů, povrchy i montážní detaily. Pokud je potřeba něco upřesnit, řešíme to předem, aby výsledek odpovídal společné domluvě.','Nábytek vyrobený pro vaše konkrétní místo.','craft'],
  ['Montáž a předání','Poslední detail. První společný den.','Domluvíme dopravu a připravenost prostoru. Nábytek na místě sestavíme, usadíme a seřídíme. Při předání projdeme používání i doporučenou péči o materiály, abyste věděli, jak o nové vybavení správně pečovat.','Hotový interiér a informace k jeho používání.','spark']
];
await savePage({path:'jak-pracujeme/',title:'Jak probíhá výroba nábytku na míru | Almara-3',description:'Od první poptávky a zaměření přes návrh a výrobu až po montáž. Podívejte se, jak probíhá spolupráce s truhlářstvím Almara-3.',breadcrumbs:processTrail,image:'dilna.webp'},breadcrumbs(processTrail)+pageIntro('Od prvního nápadu po montáž','Jasný postup.<br><em>Příjemná spolupráce.</em>','Nemusíte znát všechny materiály ani mít hotový návrh. Každým krokem vás provedeme a společně rozhodneme o tom důležitém.')+'<section class="section process-page-section"><div class="shell process-stories">'+processSteps.map(([name,title,text,result,symbol],i)=>'<article class="process-story reveal"><div class="story-number">0'+(i+1)+'</div><div><p class="eyebrow">'+name+'</p><h2>'+title+'</h2><p>'+text+'</p><div class="story-result">'+icon('check')+'<span>'+result+'</span></div></div><span class="story-icon">'+icon(symbol)+'</span></article>').join('')+'</div></section>'+faqSection('Dobré vědět<br><em>předem.</em>',[
  ['Potřebuji před první konzultací přesné výkresy?','Ne. Na začátek stačí fotografie, přibližné rozměry a popis toho, co chcete změnit. Detailní podklady a přesné zaměření připravíme v průběhu spolupráce.'],
  ['Kdy se domlouvá cena a termín?','Po ujasnění návrhu, materiálů a rozsahu dodávky. Konkrétní termín závisí také na dostupnosti materiálů, aktuální kapacitě a připravenosti vašeho prostoru.'],
  ['Co má být hotové před montáží?','Podmínky se liší podle typu nábytku. Předem si potvrdíme stav podlah, stěn a potřebných přípojek i přístup do místnosti.']
])+banner());

const galleryTrail = [{name:'Realizace a inspirace',path:'realizace/'}];
let gallery = section('work section').replace('<div class="gallery-controls">','<div class="gallery-controls" hidden>').replace('Tak může vypadat <em>váš domov.</em>','Materiály, světlo<br>a <em>dobré nápady.</em>');
await savePage({path:'realizace/',title:'Realizace a inspirace pro nábytek na míru | Almara-3',description:'Inspirace pro kuchyně, skříně, obývací pokoje a koupelny na míru. Objevte možnosti materiálů a provedení pro váš interiér.',breadcrumbs:galleryTrail,type:'CollectionPage',bodyClass:'gallery-page'},breadcrumbs(galleryTrail)+pageIntro('Prohlédněte si možnosti','Každý prostor<br>může mít <em>svůj příběh.</em>','Přírodní dřevo, klidné linie a promyšlené detaily. Ilustrační vizualizace ukazují možné směry pro váš vlastní projekt.')+gallery+'<section class="section"><div class="shell editorial-grid"><div class="reveal"><p class="eyebrow">Od inspirace k vlastnímu řešení</p><h2>Nekopírujeme pokoj.<br><em>Nasloucháme vám.</em></h2></div><div class="prose reveal"><p>Uložte si, co vás zaujalo: materiál, barevnou kombinaci nebo způsob využití prostoru. Inspirace je dobrý začátek, ale konkrétní rozměry a detaily vždy vycházejí z vašeho domova.</p><p>Fotografie interiéru a přibližné rozměry nám pomohou posoudit možnosti. Společně vybereme, které nápady dávají smysl pro vaše potřeby a rozpočet.</p>'+link('Vybrat službu pro můj prostor','sluzby/')+'</div></div></section>'+banner(),lightbox);

const contactTrail = [{name:'Kontakt',path:'kontakt/'}];
await savePage({path:'kontakt/',title:'Kontakt | Almara-3, nábytek na míru Teplice',description:'Kontaktujte Almara-3 v Teplicích. Probereme kuchyň, vestavěnou skříň nebo další nábytek na míru. Telefon, e-mail a nezávazná poptávka.',breadcrumbs:contactTrail,type:'ContactPage'},breadcrumbs(contactTrail)+pageIntro('Těšíme se na váš nápad','Dobrý projekt začíná<br><em>rozhovorem.</em>','Napište, zavolejte nebo nám pošlete představu o svém projektu. Nemusíte mít všechno promyšlené.')+'<section class="section contact-page-section"><div class="shell contact-grid">'+contactCopy+'<div class="location-card reveal"><p class="eyebrow">Kde pro vás tvoříme</p>'+icon('pin')+'<h2>Teplice<br><em>a okolí.</em></h2><p>Zaměření domlouváme přímo u vás, aby návrh vycházel ze skutečného prostoru. Možnosti zakázky ve vzdálenější lokalitě rádi probereme individuálně.</p><div class="location-divider"></div><h3>Máte už konkrétní představu?</h3><p>Popište nám typ nábytku, lokalitu a přibližné rozměry. S přípravou e-mailu vám pomůže jednoduchý formulář.</p>'+button('Připravit poptávku','poptavka/')+'</div></div></section>'+faqSection('Na první kontakt<br><em>stačí málo.</em>',[
  ['Co uvést do e-mailu?','Typ nábytku, lokalitu, přibližné rozměry a stručnou představu o materiálech. Fotografie prostoru nebo inspiraci můžete přiložit přímo k e-mailu.'],
  ['Můžeme si domluvit osobní konzultaci?','Napište nebo zavolejte a domluvíme vhodný postup. Pro návrh bývá důležité poznat přímo místo, kde má nový nábytek vzniknout.']
]));

const inquiryTrail = [{name:'Nezávazná poptávka',path:'poptavka/'}];
await savePage({path:'poptavka/',title:'Nezávazná poptávka nábytku na míru | Almara-3',description:'Poptáváte kuchyň, skříň nebo další nábytek na míru? Popište svůj projekt a připravte si e-mail pro truhlářství Almara-3 v Teplicích.',breadcrumbs:inquiryTrail,active:'kontakt/'},breadcrumbs(inquiryTrail)+pageIntro('První krok je nezávazný','Povězte nám<br>o svém <em>projektu.</em>','Jasný plán, pár rozměrů nebo zatím jen nápad. Společně z něj uděláme konkrétní zadání.')+'<section class="section section-tinted inquiry-page-section"><div class="shell contact-grid"><div class="inquiry-guide reveal"><p class="eyebrow">Začneme tím důležitým</p><h2>Co nám<br><em>pomůže vědět.</em></h2><ol><li><span>01</span><div><h3>Co si přejete vytvořit</h3><p>Kuchyň, skříň, nebo celý interiér? Napište, jak má nový prostor fungovat.</p></div></li><li><span>02</span><div><h3>Kde nábytek bude</h3><p>Uveďte lokalitu a přibližné rozměry. Přesné zaměření domluvíme později.</p></div></li><li><span>03</span><div><h3>Co vás inspiruje</h3><p>Materiály, barvy, příklady. Fotografie a půdorys můžete přiložit k připravenému e-mailu.</p></div></li></ol><p class="guide-contact">Raději se nejdřív poradíte?</p>'+link('Všechny kontaktní údaje','kontakt/')+'</div>'+inquiry+'</div></section>');

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + pages.map(page=>'  <url><loc>'+escape(absolute(page.path))+'</loc></url>').join('\n') + '\n</urlset>\n';
await writeFile(resolve(root,'sitemap.xml'),sitemap);
await writeFile(resolve(root,'robots.txt'),'User-agent: *\nAllow: /\nDisallow: /src/\nDisallow: /scripts/\nDisallow: /webdesign/\n\nSitemap: '+absolute('sitemap.xml')+'\n');
console.log('Built '+pages.length+' HTML pages, sitemap.xml and robots.txt for '+origin);
