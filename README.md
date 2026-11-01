# Ricsi a HÖK-ért – landing page vázlat (v1.5)

Egyszerű, statikus weboldal. **Csak HTML + CSS + JavaScript**, build, csomagkezelő és külső könyvtárak nélkül. A szövegek nagy része szándékosan `Lorem ipsum`: egyelőre a szerkezet és a vizuális arculat az egyeztetés tárgya.

## Fájlok

- `index.html` – **minden látható szöveg** (hero, négy „Miért indulok?” kártya, program, bemutatkozás, galéria, részletes galériatörténetek, CTA). Az egyes `template id="story-..."` részek a kártyák megnyitásakor látható hosszabb szövegek.
- `sections.css` – **Megjelenéseim és Csapatom** új, reszponzív stílusai mindkét arculathoz.
- `styles.css` – a közös reszponzív elrendezés és komponensek. `themes.css` – az elkülönített Halloween és normál arculat. `halloween-decor.css` – a ténylegesen látható szezonális grafikai elemek és mobilos elhelyezésük.
- `script.js` – mobilmenü, galériagörgetés, kép + történet dialog, **megjelenéskártyák**, **csapatprofilok és részletes profilablak**, megosztás, kontakt gomb.
- `config.js` – **valós külső URL-ek, e-mail cím, a GDE-s megjelenések és csapatprofilok adatai**. Üres hivatkozásokat a felület nem mutat kattintható linkként.
- `assets/` – az eredeti kampányképek optimalizált formátumban; `jack-o-lantern.svg` (világító, faragott tök), `ghost-white.svg` (fehér szellem), `spiderweb-bright.svg` (pókháló és pók), `bat-swarm.svg` (denevérraj), valamint a korábbi színező díszítőelemek.
- `vercel.json` – statikus Vercel-konfiguráció.

## Vázlat / publikálás előtt

1. Cseréld az `index.html` Lorem ipsum szövegeit. A felhasználói funkciókat jelölő gombok és címsorok magyarok maradtak.
2. Töröld a fenti **vázlat-jelző csíkot** az `index.html`-ből: `<aside class="draft-strip" ...>`.
3. Frissítsd az `index.html` `<title>`, `<meta name="description">`, OpenGraph szövegeit.
4. A `config.js`-ben állítsd be a saját valós kapcsolati adatokat. Jelenleg nincs kitalált domain, e-mail vagy közösségimédia-link.
5. A footerben szereplő független oldalra vonatkozó tájékoztatás maradjon meg, ha a kampány nem hivatalos egyetemi webhely.
6. A `project-feature-art` dekoratív **wireframe**, nem valódi termékképernyő.

## Kipróbálás

VS Code Live Serverrel megnyitható az `index.html`. Vagy a mappa gyökeréből:

```sh
python -m http.server 5500
```

Ezután: `http://127.0.0.1:5500/`.

## GitHub + Vercel (a váz jóváhagyása után)

Töltsd fel a mappa tartalmát egy GitHub repository gyökerébe. Importáld a repót a Vercel New Project oldalán. Framework preset: **Other**, build command: üres, output directory: `.`. A domain beállítását **csak a végleges webcím ismeretében** végezd el a Vercel Project → Settings → Domains menüjében; a DNS rekordok értékét a Vercel aktuálisan kijelzett utasításaiból vedd át.

Nincs bejelentkezés, adatbázis, szerveroldali űrlap vagy analitika. Az „Írj nekem” gomb konfigurált cím esetén e-mail klienst nyit.

## Két automatikusan váltakozó arculat (v1.5)

A weboldal **egyetlen** HTML-szerkezetet és kampánykészletet használ; `themes.css` kezeli a két arculatot, `theme.js` automatikusan kiválasztja az aktívat. Nincs keretrendszer vagy csomagkezelő.

- **Halloween:** minden évben **október 20-tól november 2-ig**, a `Europe/Budapest` naptári dátum szerint. Sötétlila-fekete alap, narancssárga fények, jól látható világító tökök, fehér szellemek, pókhálók és denevérek. A szezonális elemek a fejlécben, a főképen, az egyes blokkok sarkainál és a kapcsolatfelvételi részen is láthatók.
- **Normál narancs:** **november 3-tól október 19-ig**. Letisztult fekete–narancs hangulat, szezonális elemek nélkül.

**Mindkettő kipróbálható bármikor**, anélkül hogy a látogatók számára átállítanád az oldalt:

- `http://127.0.0.1:5500/?theme=halloween`
- `http://127.0.0.1:5500/?theme=classic`

Éles környezetben a domain után ugyanígy megadható a lekérdezési paraméter. Paraméter nélkül az aktuális dátum számít. A naptári intervallum és az automatikus/manuális üzemmód a `config.js` elején módosítható. A `?theme=` csak az adott URL megtekintését módosítja; nem változtatja meg a kampány alapbeállításait. A böngésző-fülre való visszatéréskor a téma is újraértékelődik.

**Új elemek v1.3-hoz képest:** `halloween-decor.css` és négy új, helyben tárolt SVG: `jack-o-lantern.svg`, `ghost-white.svg`, `spiderweb-bright.svg`, `bat-swarm.svg`. Az `index.html` dekoratív elemeket kapott, a szövegek és a kampányfotók változatlanok. Az összes dekoráció automatikusan eltűnik a normál témában. A korábbi mobil nyitóképszélességi hibát is korrigáltam. A dekorációk nem gyűjtenek adatot, nem töltenek be külső képeket, nem igényelnek JavaScript-animációs csomagot.

**Finomhangolás:** az illusztrációk mérete és pozíciója kizárólag a `halloween-decor.css` fájlban módosítható. A mozgó szellemek animációja a csökkentett mozgást kérő böngészőbeállítást tiszteletben tartja.

## Két új szekció (v1.5)

**Megjelenéseim** (`#megjelenesek`): három szerkeszthető mintakártya PR-megjelenésekhez, GDE-posztokhoz és közösségi bejegyzésekhez. A `config.js` `mediaAppearances` tömbjének minden objektuma külön kártya:

```js
{
  type: "GDE / FACEBOOK",
  date: "2026. 10. 31.",
  title: "A poszt címe",
  excerpt: "A poszt rövid bevezetése.",
  url: "https://valodi-eredeti-poszt-url",  // ha üres, nincs aktív link
  image: "assets/megjelenes-01.webp"     // opcionális; ha üres, grafikus előnézet
}
```

A `mediaAppearances` elemei tetszőlegesen bővíthetők, eltávolíthatók vagy átrendezhetők. A kártya csak akkor kap **Eredeti poszt megnyitása** linket, ha a `url` érvényes `http://` vagy `https://` cím. Nincsenek feltételezett GDE-posztok vagy kitalált URL-ek. Ha szeretnél a posztból képet mutatni, töltsd le (jogosult felhasználással) az `assets` mappába és add meg a relatív fájlnevet.

**Csapatom** (`#csapatom`): három mintaprofil, kattintható profilkártyákkal. Megnyitáskor felugró részletes nézet látszik, portréval, szerepkörrel, bemutatkozó szöveggel, fókuszterületekkel, opcionális közösségi hivatkozásokkal, valamint előző/következő navigációval. Minden elem a `config.js` `teamMembers` tömbjében szerkeszthető:

```js
{
  name: "Valódi csapattag neve",
  role: "Szerepkör",
  tagline: "Rövid bemutatkozás a kártyán.",
  image: "assets/csapattag-neve.webp",   // opcionális
  bio: ["Első bekezdés...", "Második bekezdés..."],
  focus: ["Első terület", "Második terület"],
  links: { instagram: "", linkedin: "" }
}
```

A megadott kép helyi `assets/` fájlra mutasson (PNG, JPG, WebP, SVG). Kép nélkül semmi nem törik el: automatikusan az `assets/team-placeholder.svg` absztrakt profilillusztrációt használja. Fotót csak az érintett jóváhagyásával publikálj. A név és szövegek jelenleg helykitöltők, a kártyák **nem állítanak valódi csapattagságot**.

**Elrendezés:** 1440 px körül 3 kártya egy sorban; 1050 px alatt 2 oszlop, 720 px alatt 1 oszlop. A csapatprofilt mobilon teljes szélességű, gördíthető `dialog` jeleníti meg. A mobilmenü a bővült navigáció miatt már 1120 px alatt is megjelenik, hogy a menüpontok ne ütközzenek.

A Halloween és a normál téma továbbra is automatikus; a két új szekció ugyanazt a közös adatforrást használja. **A szellemvadász játék egyelőre csak korábbi látványterv volt, nem része a működő HTML-verziónak.**
