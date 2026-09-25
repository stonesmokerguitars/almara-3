# Audit obsahu a podkladů k doplnění

Stav při kontrole: 25. 9. 2026. Jde o redakční checklist podle textů ve zdrojích webu, konfigurace a README — nikoli o ověření údajů u firmy ani právní audit. Položky označené **ověřit** mohou být správné, ale před zveřejněním je potřeba potvrdit jejich aktuálnost.

## Před zveřejněním ověřit

- [ ] **Telefon:** web používá `+420 777 123 456` a `tel:+420777123456`. README uvádí, že kontakt je převzatý z původního webu. Potvrdit, že je číslo stále správné a že se na něm dá přijímat poptávka.
- [ ] **E-mail:** `info@almara-3.cz` je uveden na webu i v konfiguraci. Ověřit doručování, obsluhu schránky a zda je to preferovaný veřejný kontakt.
- [ ] **Doména:** `https://almara-3.cz` je v konfiguraci výslovně odvozená z e-mailu, nikoli potvrzená jako ostrá doména. Potvrdit finální doménu a variantu s/bez `www` před nasazením; promítá se do canonical URL, sitemap i strukturovaných dat.
- [ ] **Právní identita:** konfigurace a patička uvádějí „Almara-3 s.r.o.“. Ověřit přesný zapsaný název a rozhodnout, zda zveřejnit IČO, případně DIČ a adresu sídla. Tyto údaje nyní na webu nejsou.
- [ ] **Místo a dosah služeb:** hlavní lokalita je uvedena jako Teplice a okolí. Upřesnit, které obce či okresy firma běžně obsluhuje, kam dojíždí a zda se podmínky liší podle vzdálenosti. Zatím nejsou pojmenované žádné další obce.
- [ ] **Reálný provoz kontaktu:** ověřit, zda lze uvádět osobní konzultaci či zaměření u zákazníka, jak probíhá první návštěva a zda existují hodiny, kdy je vhodné volat. Otevírací/pracovní doba ani adresa dílny či showroomu nejsou uvedeny.

## Co chybí k důvěryhodnému příběhu firmy

- [ ] **Jména a lidé za značkou:** texty mluví za Almara-3 v první osobě množného čísla, ale neuvádějí majitele, truhláře ani kontaktní osobu. Doplnit jména, role a krátké ověřené medailonky, pokud je firma chce veřejně prezentovat.
- [ ] **Skutečná zkušenost:** nejsou uvedené roky praxe, rok založení, počet realizovaných projektů, kvalifikace ani jiné ověřitelné milníky. Doplnit jen doložitelné údaje; čísla nyní nevymýšlet.
- [ ] **Dílna a zázemí:** stránka „O nás“ popisuje přístup k práci, ale chybí konkrétní příběh firmy, fotografie skutečného týmu/dílny a informace, zda zákazníci mohou navštívit vzorkovnu.
- [ ] **Reference:** galerie je koncipovaná jako inspirace; README výslovně upozorňuje, že jde o ilustrační vizualizace, nikoli ověřené fotografie zakázek. Buď ponechat velmi zřetelné označení inspirace, nebo ji nahradit skutečnými realizacemi s popisky (typ zakázky, obec, rok, použité řešení) a souhlasem klientů.
- [ ] **Recenze:** fiktivní recenze nejsou použité, což je správně. Pokud budou doplněny, získat skutečné citace se souhlasem autora a uvést zdroj; jinak sekci recenzí nepřidávat.

## Obchodní informace, které zákazník před poptávkou hledá

- [ ] **Cena a rozpočet:** texty zmiňují rozpočet, ale nevysvětlují, jak vzniká nabídka, zda je konzultace/návrh/zaměření placené, jak se schvalují změny ani jaké jsou platební podmínky. Připravit firemně potvrzené znění; případné orientační ceny zveřejnit jen tehdy, jsou-li dlouhodobě udržitelné.
- [ ] **Termíny:** web slibuje potvrzení harmonogramu individuálně, ale neuvádí obvyklou čekací dobu na zaměření, návrh, výrobu a montáž. Doplnit realistický rámec nebo jasně vysvětlit, na čem závisí.
- [ ] **Záruka a následná péče:** není popsáno předání, záruka, servis, reklamace ani doporučená údržba povrchů. Doplnit schválené obchodní informace a návaznost na zákonné podmínky.
- [ ] **Rozsah realizace:** u rekonstrukcí a komerčních interiérů text zmiňuje návaznost na další profese, ale není jasné, které práce Almara-3 zajišťuje sama a které pouze koordinuje či domlouvá s partnery. Vyjasnit, aby text nesliboval neprováděné služby.
- [ ] **Podklady k poptávce:** formulář žádá jméno, e-mail, nepovinně telefon, typ projektu a popis. Ujasnit, kdo poptávku vyřizuje, kdy lze čekat odpověď a zda existuje alternativní způsob zaslání fotografií/výkresů; současný formulář pouze otevře e-mailovou aplikaci návštěvníka.

## Lokální SEO a texty jednotlivých stránek

- [ ] **Konkrétní lokality:** „Teplice a okolí“ je konzistentní hlavní lokalita, ale pro lokální dohledatelnost chybí potvrzený seznam reálně obsluhovaných měst/obcí (např. Most, Bílina či Ústí nad Labem uvádět pouze po potvrzení firmy). Následně přirozeně doplnit tam, kde to pomůže návštěvníkovi — ne vyrábět hromadu téměř stejných SEO stránek pro města bez samostatné hodnoty.
- [ ] **Místní kontext:** stránky služeb obecně uvádějí Teplice v titulcích a textech, ale nemají konkrétní lokální příklady, fotografie či zkušenosti z jednotlivých obcí. Doplnit skutečné příklady, až budou k dispozici.
- [ ] **FAQ podle zkušeností firmy:** každá služba má vlastní texty a otázky, ale část obchodních odpovědí (cena, termín, zaměření, montáž, záruka) zůstává záměrně obecná. Po potvrzení firemních podmínek doplnit konkrétní odpovědi na každou stránku podle daného typu nábytku.
- [ ] **Oborové limity a nabídka:** u jednotlivých služeb potvrdit, co firma skutečně vyrábí/montuje a jaké materiály či technické varianty umí dodat. Texty jsou obsahově bohaté, ale obecné formulace samy nepotvrzují reálnou nabídku.

## Drobné neúplnosti a technicko-redakční poznámky

- [ ] **Zdroj formuláře:** v `src/home.html` jsou za první položkou `<select>` další názvy služeb zapsané bez otevíracích značek `<option>`. Generátor je při vytváření stránek nahrazuje korektním seznamem z `src/services.mjs`, takže aktuálně generovaná stránka výběr dostává, ale zdrojová šablona je neúplná a její ruční použití by bylo chybné. Opravit při nejbližší úpravě formuláře.
- [ ] **Soukromí:** formulář data neposílá serveru; připraví e-mail v aplikaci návštěvníka. Před ostrým sběrem poptávek doplnit srozumitelné informace o zpracování osobních údajů a ověřit, jaké povinnosti se na reálný způsob provozu vztahují.
- [ ] **Sociální sítě:** v prohlédnutých zdrojích není odkaz na aktivní profil ani jiné veřejné kanály. Doplnit pouze aktuální profily, které firma opravdu spravuje.
- [ ] **Fotografie:** ověřit původ a oprávnění ke všem fotografiím i logu. U skutečných interiérů zajistit souhlas s publikací a odstranit identifikující detaily, které klient nechce zveřejnit.

## Co už web pokrývá

- Je vytvořen vícestránkový web s přehledem 14 služeb a samostatnými stránkami pro jednotlivé služby, kontakt, poptávku, realizace/inspiraci, postup spolupráce a informace o firmě.
- Hlavní oblast Teplice a okolí je uvedena na homepage, kontaktní stránce a ve službách/SEO metadatech.
- Služby mají vlastní úvodní texty, popisy řešení a otázky; není nutné doplňovat obsah jen kvůli množství klíčových slov.
- Jsou uvedeny telefon, e-mail a kontaktní formulář s vysvětlením, že odeslání dokončí návštěvník ve své e-mailové aplikaci.
- Web nepoužívá vymyšlené recenze a README upozorňuje na ilustrační charakter galerie.

## Doporučené pořadí

1. Potvrdit doménu, e-mail, telefon a právní identitu.
2. Potvrdit konkrétní obsluhované lokality a skutečný rozsah služeb.
3. Doplnit reálné osoby, fotografie a ověřené reference — nebo výslovně ponechat anonymnější značkový tón a galerii jako inspiraci.
4. Schválit znění o ceně, termínech, zaměření, platbách, záruce a servisu.
5. Doplnit soukromí a opravit zdrojovou šablonu výběru služby ve formuláři.
