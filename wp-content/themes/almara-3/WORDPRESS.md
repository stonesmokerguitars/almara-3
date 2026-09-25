# Nasazení šablony Almara-3 ve WordPressu

## Co šablona přidává

- Vlastní typ obsahu **Služby** (`sluzba`) s adresami zachovávajícími původní podobu, například `/kuchyne-na-miru/`.
- Nativní editaci hlavních nadpisů, perexů, úvodních obrázků, SEO titulků a meta popisů. Texty jednotlivých sekcí zůstávají v běžném editoru stránky/příspěvku.
- Stránku přehledu služeb `/sluzby/`, která vypisuje služby z CPT.
- Nastavení telefonu, e-mailu, oblasti působení a názvu firmy v **Vzhled → Nastavení Almara-3**.
- WordPress menu v **Vzhled → Menu** pro hlavní navigaci a patičku; bez nastaveného menu fungují připravené výchozí odkazy.
- Jednorázový import stávajícího obsahu přes **Nástroje → Import obsahu Almara-3**. Import vytvoří homepage, informační stránky a 14 služeb, původní HTML soubory nemaže a již existující záznamy nepřepisuje.

## První spuštění

1. Dokončete instalaci WordPressu v této složce. V okamžiku přípravy šablony zde ještě nebyl `wp-config.php`, takže databáze a administrace musí být nakonfigurované zvlášť.
2. V administraci otevřete **Vzhled → Šablony** a aktivujte **Almara-3**.
3. Otevřete **Nástroje → Import obsahu Almara-3** a spusťte import. Převádí připravené statické HTML stránky do WordPressu a nastaví úvodní stránku.
4. V **Nastavení → Trvalé odkazy** zvolte strukturu s názvem příspěvku (např. `/%postname%/`) a uložte ji. Díky tomu budou fungovat samostatné adresy služeb.
5. Zkontrolujte **Nastavení → Čtení**, hlavní menu a údaje v **Vzhled → Nastavení Almara-3**. Telefon, e-mail, doménu a právní informace ověřte před zveřejněním.

## Úpravy obsahu

V administraci otevřete **Služby** a upravte konkrétní službu. Hlavní pole jsou ve schránce „Almara-3 · úvodní a SEO údaje“; delší texty, FAQ a jednotlivé obsahové sekce jsou v editoru obsahu. Běžné stránky mají obdobná pole pro úvod a SEO. Obrázky lze vybrat z knihovny médií.

Původní HTML sekce se importují jako obsahové HTML, aby se zachovalo rozvržení a animace. Při úpravě složitějších sekcí může být potřeba použít editor kódu / HTML bloku; nadpisy, perexy, SEO a hlavní obrázek jsou naopak připravené jako samostatná pole.

## Poznámky

- Šablona nepoužívá ACF ani jiný povinný plugin; CPT a pole registruje sama.
- Nasazení neprovádí automatickou změnu databáze. Import obsahu spouští administrátor ručně a opakované spuštění již vytvořené položky přeskočí.
- Původní statické HTML zůstává ve složce šablony jako zdroj pro import; WordPress z něj po importu na webu obsah nevykresluje.
- Pro rozšířené SEO, XML sitemapu a Open Graph lze následně přidat SEO plugin. Šablona zároveň podporuje WordPress title a canonical.
