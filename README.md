# Ricsi a HÖK-ért – GTA IV ihletésű kampányoldal

**Éles oldal:** https://dumitrescu.hu  
**GitHub:** https://github.com/Trescu/kampany

Statikus, reszponzív HTML/CSS/JavaScript landing page, build-eszköz és külső keretrendszer nélkül.

## Jelenlegi megjelenés

- GTA IV menühangulat: nagy, sötét menüfelületek, fakó/borongós egyetemi háttér, sárga aktív menüpont.
- Sticky felső navigáció és külön, billentyűzettel is bejárható Hero-menü.
- Mobilos hamburger menü; a sárga kijelölés követi az aktuális szekciót.
- **Halloween kézi kapcsoló:** alapállapot a GTA-stílusú normál oldal; kattintásra Halloween-dekoráció, majd visszaváltás. A választás böngészőnként megmarad. A szellemvadász játék **még nincs implementálva**, külön fejlesztési lépés.
- A Hero jelenleg a repositoryban korábban meglévő `assets/campus-brown.webp` kampányképet használja (mobilon `assets/campus-maroon.webp`). A korábbi, jóváhagyott menü-mockup pontos portréjának új képi exportja **még hátravan**.

## Oldalszekciók

1. Főoldal / Hero – `#fooldal`
2. Miért indulok? – `#miert-en`
3. Programom – `#programom`; eHÖK kiemelt projekt
4. Megjelenéseim, eddigi munkám – `#megjelenesek`
5. Csapatom – `#csapatom`, megnyitható részletes profilok
6. Kampánygaléria – `#galeria`, képek és történetek
7. Kapcsolat – `#kapcsolat`
8. Footer – visszalépés a tetejére, független kampányoldal jelölés

## Fontos fájlok

- `index.html`: szerkezet, ideiglenes szövegek, Hero, galéria és dialógusok.
- `gta.css`: **új fő arculati felülírás**, ez töltődik be legutoljára.
- `gta.js`: Halloween-kapcsoló, aktív menüpont-követés, Hero-menü nyílbillentyűi.
- `styles.css`, `sections.css`: meglévő szekciók, reszponzív komponensek.
- `themes.css`, `halloween-decor.css`: a korábbi Halloween-dekoráció.
- `theme.js`: manuális témaválasztás, alapértelmezett normál mód.
- `script.js`: mobilmenü, média, csapatprofil, galéria, megosztás és kapcsolat.
- `config.js`: valós média-megjelenések, csapattagok, közösségi linkek, e-mail.
- `assets/`: jelenleg publikált képek és helyi dekorációs SVG-k.

## Tartalmi állapot

A projekt a látvány és a működő navigáció első GTA-stílusú iterációja. A korábbi `Lorem ipsum` szövegek, mintakártyák és csapatprofilok **továbbra is szerkesztendők**; az oldal nem állítja róluk, hogy valósak. A kapcsolati és média-hivatkozások a `config.js` fájlban csak valódi adatokkal aktiválódnak.

Ne publikálj kitalált választási dátumot, csapattagnevet vagy GDE-megjelenést.

## Helyi teszt

```bash
python -m http.server 5500
```

Böngésző: http://127.0.0.1:5500

Kényszerített téma előnézethez: `?theme=classic` vagy `?theme=halloween`. Normál használatkor a kézi kapcsoló dönt; az értéket a böngésző megőrzi.

A Vercel a GitHub `main` ágát automatikusan élesíti.
