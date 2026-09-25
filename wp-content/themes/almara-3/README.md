# Almara-3

Tento adresář je připravená WordPress šablona. Po její aktivaci spusťte jednorázový bezpečný převod obsahu přes **Nástroje → Import obsahu Almara-3**. Podrobný postup a popis polí najdete v [WORDPRESS.md](WORDPRESS.md).

Responzivní vícestránkový web podle `webdesign/webdesign-preview.png`. Obsahuje 21 samostatných HTML stránek: úvod, 14 služeb, přehled služeb, realizace a inspiraci, postup spolupráce, o nás, kontakt a poptávku. Hotové HTML soubory fungují bez runtime závislostí a bez JavaScriptu zpřístupňují celý obsah i odkazy.

## Spuštění

Otevřete projekt přes lokální webserver (např. XAMPP), případně:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Náhled pak běží na `http://127.0.0.1:4173`.

## Úpravy a generování stránek

- `src/home.html`: zdroj homepage a společných částí, které používá generátor.
- `src/services.mjs`: 14 služeb, jejich vlastní texty, titulky, otázky a související služby.
- `scripts/build.mjs`: společné šablony a obsah informačních stránek; generuje všechny HTML stránky.
- `site.config.mjs`: produkční doména, název, e-mail a oblast působení.
- `styles.css`: barvy, typografie, layout, responzivita a animace.
- `script.js`: menu, galerie, filtry, animované rozbalování a předvyplnění e-mailu.
- `assets/images/ASSETS.md`: původ obrázků, prompty a informace o vektorizaci loga.

Po úpravě obsahu nebo konfigurace spusťte (Node.js, bez instalace balíčků):

```sh
node scripts/build.mjs
```

Výstupní `index.html` soubory neupravujte ručně; další generování je nahradí. CSS, JavaScript a obrázky se používají přímo a jejich změna generování nevyžaduje.

Kontrola vygenerovaných stránek a odkazů:

```sh
node scripts/check.mjs
```

Ověřuje unikátní titulky a popisy, H1, ID, canonical, JSON-LD, vazbu na sitemapu a existenci interních odkazů i obrázků.

## SEO a nasazení

Každá stránka má vlastní URL, title, meta description, jeden H1, self-canonical, Open Graph a strukturovaná data. Podstránky obsahují drobečkovou navigaci a BreadcrumbList, služby také Service. Všechny služby jsou propojené přes katalog, související služby a patičku. `sitemap.xml` a `robots.txt` vznikají společně s HTML.

Výchozí doména `https://almara-3.cz` je odvozená z dosavadního kontaktního e-mailu. Před nasazením potvrďte skutečnou doménu (včetně případného www) v `site.config.mjs` a znovu vygenerujte stránky. Na hostingu sjednoťte HTTPS, www a `index.html` varianty přesměrováním na zvolenou doménu a adresy s koncovým lomítkem. Odeslání sitemap do Search Console a nasazení webu nejsou součástí lokální implementace.

Relativní interní odkazy fungují i při vývoji v podadresáři XAMPP. Sitemap a canonical záměrně používají produkční adresy.

Struktura vychází z doporučení [Google pro procházetelné odkazy](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [základů SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) a [tvorby sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Samotné technické nastavení nezaručuje umístění ve výsledcích vyhledávání.

Písma DM Sans a DM Serif Display se načítají z Google Fonts, s lokálními systémovými fallbacky.

## Poptávka a obsah

Formulář připravuje skutečný e-mail v aplikaci návštěvníka pomocí `mailto:`. Odeslání dokončí návštěvník ve své e-mailové aplikaci. Web nemá serverové odesílání, přílohy se přidávají až k e-mailu a nezobrazuje se nepravdivé potvrzení o odeslání. Vyplněné údaje se nemažou.

Kontaktní telefon a e-mail pocházejí z původního webu. Před zveřejněním je ověřte. Ilustrační galerie je označená; nahraďte ji ověřenými fotografiemi realizací, pokud ji chcete prezentovat jako portfolio skutečných zakázek. Fiktivní recenze nejsou použité.

Animace respektují `prefers-reduced-motion`. Galerie používá nativní dialog a podporuje klávesy se šipkami, Escape a dotykové gesto. Mobilní menu podporuje klávesnici. Služby jsou běžné samostatné HTML stránky. Poptávka přebírá zvolenou službu z parametru `sluzba` v URL.
