# Nasazení šablony Almara-3 ve WordPressu

## Co šablona přidává

- Vlastní typ obsahu **Služby** (`sluzba`) s adresami zachovávajícími původní podobu, například `/kuchyne-na-miru/`.
- Nativní editaci hlavních nadpisů, perexů, úvodních obrázků, SEO titulků a meta popisů. Texty jednotlivých sekcí zůstávají v běžném editoru stránky/příspěvku.
- Stránku přehledu služeb `/sluzby/`, která zachovává původní grafický katalog a odkazuje na samostatné záznamy služeb v CPT.
- Nastavení telefonu, e-mailu, oblasti působení a názvu firmy v **Vzhled → Nastavení Almara-3**.
- WordPress menu v **Vzhled → Menu** pro hlavní navigaci a patičku; bez nastaveného menu fungují připravené výchozí odkazy.
- Jednorázový automatický import stávajícího obsahu po aktivaci šablony. Vytvoří homepage, informační stránky a 14 služeb, přiřadí šablony stránek, původní HTML soubory nemaže a již existující záznamy nepřepisuje. Ruční opakování je dostupné v **Nástroje → Import obsahu Almara-3**.

## První spuštění

1. Spusťte WordPress a databázi a aktivujte **Almara-3** ve **Vzhled → Šablony**. Při prvním načtení šablona doplní připravené stránky a služby.
2. Ověřte **Nastavení → Čtení**: jako úvodní stránka má být přiřazena „Domů“. Importované stránky mají vlastní šablony Almara.
3. V **Nastavení → Trvalé odkazy** použijte pěkné URL, ideálně `/%postname%/`. Pro 14 původních služeb šablona registruje adresy přímo v kořeni, například `/kuchyne-na-miru/`.
4. Zkontrolujte hlavní menu a údaje v **Vzhled → Nastavení Almara-3**. Telefon, e-mail, doménu a právní informace ověřte před zveřejněním.

## Úpravy obsahu

V administraci otevřete **Služby** a upravte konkrétní službu. Hlavní pole jsou ve schránce „Almara-3 · úvodní a SEO údaje“; delší texty, FAQ a jednotlivé obsahové sekce jsou v editoru obsahu. Běžné stránky mají obdobná pole pro úvod a SEO. Obrázky lze vybrat z knihovny médií.

Původní HTML sekce se importují jako obsahové HTML, aby se zachovalo rozvržení a animace. Při úpravě složitějších sekcí může být potřeba použít editor kódu / HTML bloku; nadpisy, perexy, SEO a hlavní obrázek jsou naopak připravené jako samostatná pole.

## Poznámky

- Šablona nepoužívá ACF ani jiný povinný plugin; CPT a pole registruje sama.
- Šablona při prvním načtení doplní chybějící připravené stránky do databáze. Opakovaný import již vytvořené položky nepřepisuje; jednorázové opravy doplní pouze prázdná pole původně importovaných záznamů.
- Původní statické HTML zůstává ve složce šablony jako zdroj pro import; WordPress z něj po importu na webu obsah nevykresluje.
- Pro rozšířené SEO, XML sitemapu a Open Graph lze následně přidat SEO plugin. Šablona zároveň podporuje WordPress title a canonical.
