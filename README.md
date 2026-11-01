# Ricsi a HÖK-ért – egyoldalas kampánygaléria

Az oldal jelenlegi, egyszerűsített változata: **egy kép és a hozzá tartozó blogjellegű szöveg**, a történetek között navigálva.

## Eredet
A felület a `f891dfe` GitHub-commit régi `image-modal` nézetére és annak 5 `story-*` HTML-sablonjára épül. A korábbi felugró ablakot az oldal állandó, központi szerkezetévé alakítottuk: `modal-top`, `modal-content`, `modal-media`, `modal-navigation`, `modal-story`.

## Fájlok
- `index.html` – az egyetlen oldal és az eredetileg is létező öt történetsablon.
- `gallery-page.css` – a régi kétoszlopos blognézetből kialakított, reszponzív stílus.
- `gallery-page.js` – előző/következő képek, nyílbillentyűk, mobilos swipe, `#kep-1` … `#kep-5` hivatkozások.
- `assets/` – a meglévő öt kampányfotó, változatlanul.

A korábbi sokmenüs és GTA IV-es fájlok továbbra is a repositoryban vannak, de az `index.html` nem tölti be őket. A Git history-ból teljesen visszaállíthatók.

## Tartalom
A régi történetsablonok **eredeti, Lorem ipsum helykitöltő szövegei** maradtak meg az egyoldalas nézetben. A megszűnt `#programom` aloldalra vezető hivatkozásokat eltávolítottuk. A kampányszövegeket véglegesítés előtt ki kell cserélni.

## Képi működés
Asztali nézeten balra nagy kép, jobbra hosszabb blogszöveg, mobilon egymás alatt. A képek `object-fit: contain` beállítással, levágás nélkül jelennek meg. Az `Előző` / `Következő` gombok egy új kép+szöveg párost töltenek be. A használat nem igényel JavaScript buildet vagy külső függőséget.

## Képernyőmagassághoz igazítás (v2)
A galéria a böngésző látható területét tölti ki (`100dvh`), nem görgethető. A fotó `object-fit: contain` beállítással levágás nélkül tölti ki a rendelkezésre álló teret. A hosszú blogszöveg a jobb oldali oszlopban oldalakra oszlik; a szöveg alatt külön lapozó van. Mobilon a `Kép` és `Történet` nézet váltása teszi lehetővé a teljes képernyős, görgetés nélküli használatot. A képváltó gombok folyamatosan láthatók.
