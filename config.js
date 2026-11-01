/*
 * Kampányoldal beállításai.
 * Csak valódi, már létező linkeket adj meg. Üresen hagyott külső hivatkozások
 * automatikusan rejtve maradnak; nem kerülnek kitalált címek az oldalra.
 *
 * E-mail: contactEmail: "...@..."
 * Webcím: siteUrl: "https://...vercel.app" (publikálás után)
 * Hivatalos szavazási tájékoztató: voteUrl: "https://..." (ha elérhető)
 * Közösségi oldalak: socialLinks.instagram/facebook/tiktok/linkedin
 */
window.CAMPAIGN_CONFIG = {
  // Automatic theme: Halloween every year from October 20 through November 2.
  // "auto" | "halloween" | "classic". Use ?theme=classic / ?theme=halloween to preview.
  theme: { mode: "auto", halloweenFrom: "10-20", halloweenThrough: "11-02", timeZone: "Europe/Budapest" },
  contactEmail: "",
  contactSubject: "Hallgatói javaslat – HÖK kampány",
  siteUrl: "",
  voteUrl: "",
  socialLinks: {
    instagram: "",
    facebook: "",
    tiktok: "",
    linkedin: ""
  },
  // Megjelenések: csak akkor lesz "Poszt megnyitása" gomb, ha url valódi http(s) link.
  // image: opcionális helyi kép, például "assets/megjelenes-01.webp"; üresen dekoratív előnézet.
  mediaAppearances: [
    { type: "GDE / ONLINE", date: "DÁTUM HELYE", title: "Lorem ipsum dolor sit amet", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed placerat leo.", url: "", image: "" },
    { type: "KÖZÖSSÉGI POSZT", date: "DÁTUM HELYE", title: "Consectetur adipiscing elit", excerpt: "Praesent efficitur ex non neque interdum, ut semper nulla pretium.", url: "", image: "" },
    { type: "ESEMÉNY / MEGJELENÉS", date: "DÁTUM HELYE", title: "Praesent dictum nibh", excerpt: "Vestibulum euismod sapien vitae lectus tincidunt, sed porttitor erat porta.", url: "", image: "" }
  ],
  // Csapat: egy objektum = egy profilkártya + megnyitható részletes profil.
  // image: például "assets/csapat-anna.webp" (feltöltött, engedéllyel használt fotó).
  // Ne hagyj publikusan élesben fiktív profilokat: ezek kizárólag minták.
  teamMembers: [
    { name: "Csapattag 01", role: "Lorem ipsum", tagline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "", bio: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dignissim est in ipsum feugiat, non pretium magna aliquam.", "Maecenas gravida nulla non pharetra imperdiet. Aliquam erat volutpat, vestibulum pulvinar augue eget justo aliquet."], focus: ["Lorem ipsum", "Dolor sit amet"], links: { instagram: "", linkedin: "" } },
    { name: "Csapattag 02", role: "Dolor sit amet", tagline: "Curabitur commodo, tortor eget vulputate dignissim, libero mi tincidunt ex.", image: "", bio: ["Curabitur sollicitudin egestas ligula. Donec sit amet lacus pretium, posuere lorem a, posuere arcu.", "Sed commodo dui ac magna bibendum, ut varius elit porttitor. Pellentesque vitae massa quam."], focus: ["Consectetur", "Adipiscing elit"], links: { instagram: "", linkedin: "" } },
    { name: "Csapattag 03", role: "Consectetur elit", tagline: "Vestibulum eu felis in augue interdum aliquam vitae at erat.", image: "", bio: ["Vestibulum eu felis in augue interdum aliquam vitae at erat. Proin sed erat ipsum. Donec sit amet pretium dolor.", "Nam tincidunt quis risus eu luctus. Aenean dictum molestie dolor, quis imperdiet ipsum consequat vitae."], focus: ["Aenean varius", "Nulla facilisi"], links: { instagram: "", linkedin: "" } }
  ],
  shareTitle: "Ricsi a HÖK-ért – Weboldal-vázlat",
  shareText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
};
