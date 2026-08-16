export type Locale = "en" | "tr";

export const LOCALES: Locale[] = ["en", "tr"];
export const DEFAULT_LOCALE: Locale = "tr";
export const LOCALE_STORAGE_KEY = "scratch:locale";

export type Messages = {
  nav: {
    home: string;
    lists: string;
    watched: string;
    lang: string;
  };
  home: {
    brand: string;
    headlineLine1: string;
    headlineLine2: string;
    sub: string;
    chooseList: string;
    featuredCta: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    sub: string;
    seeAll: string;
  };
  lists: {
    eyebrow: string;
    title: string;
    sub: string;
    filmCount: string;
    enter: string;
  };
  intro: {
    titles: string;
    wallFallback: string;
    listFallback: string;
    taglineFallback: string;
    body: string;
    openWall: string;
    backLists: string;
  };
  wall: {
    loading: string;
    revealed: string;
    fallbackDemo: string;
    back: string;
    share: string;
    shared: string;
    copied: string;
    shareUnsupported: string;
    shareBody: string;
    reset: string;
    resetting: string;
    resetConfirm: string;
    hint: string;
    error: string;
    retry: string;
    defaultDesc: string;
  };
  reveal: {
    stamped: string;
    trailer: string;
    noTrailer: string;
    backWall: string;
    watched: string;
  };
  watched: {
    eyebrow: string;
    title: string;
    sub: string;
    clearAll: string;
    clearConfirm: string;
    empty: string;
    chooseList: string;
    backToWall: string;
    remove: string;
  };
  teaser: {
    aria: string;
    drag: string;
    ritual: string;
    ritualSub: string;
    chooseList: string;
    tryAgain: string;
    preview: string;
    cleared: string;
  };
  listsCopy: Record<
    string,
    { description: string; tagline: string }
  >;
  listsCopyFallback: string;
};

export const en: Messages = {
  nav: {
    home: "Home",
    lists: "Lists",
    watched: "Watched",
    lang: "Language",
  },
  home: {
    brand: "SCRATCH",
    headlineLine1: "Stop scrolling.",
    headlineLine2: "Start scratching.",
    sub: "Can't decide what to watch? Scratch the wall, find your film.",
    chooseList: "Choose a list",
    featuredCta: "Featured lists",
  },
  featured: {
    eyebrow: "Featured lists",
    title: "Worlds worth scratching.",
    sub: "Start here. One list. One ritual.",
    seeAll: "See all lists",
  },
  lists: {
    eyebrow: "Choose a list",
    title: "One list. One ritual.",
    sub: "Pick a world. Scratch the foil. Meet your film.",
    filmCount: "{count} films",
    enter: "Enter →",
  },
  intro: {
    titles: "{count} titles",
    wallFallback: "Poster wall",
    listFallback: "Movie list",
    taglineFallback: "Scratch the wall. Track your films.",
    body: "Every film on the wall. Scratch what you've watched. Your progress stays when you come back.",
    openWall: "Open the wall",
    backLists: "Back to lists",
  },
  wall: {
    loading: "Loading wall…",
    revealed: "{count} / {total} revealed",
    fallbackDemo: "Demo posters — set TMDB_API_KEY for the full vault.",
    back: "Back",
    share: "Share progress",
    shared: "Shared",
    copied: "Copied to clipboard",
    shareUnsupported: "Sharing not supported",
    shareBody: "SCRATCH · {list}\n{count} / {total} revealed\nStop scrolling. Start scratching.",
    reset: "Reset progress",
    resetting: "Resetting…",
    resetConfirm:
      "Reset all scratch progress for this list? This cannot be undone.",
    hint: "Scroll the wall · scratch with the coin · progress is saved",
    error: "Could not load the poster wall.",
    retry: "Try again",
    defaultDesc: "Scratch what you've seen. Come back anytime.",
  },
  reveal: {
    stamped: "Revealed · Added to Watched",
    trailer: "Trailer",
    noTrailer: "No trailer available for this title.",
    backWall: "Back to wall",
    watched: "Watched",
  },
  watched: {
    eyebrow: "History",
    title: "Watched",
    sub: "Films land here when you scratch them open. Remove any one anytime.",
    clearAll: "Clear all",
    clearConfirm: "Clear your entire watched history? This cannot be undone.",
    empty: "No tickets stamped yet.",
    chooseList: "Choose a list",
    backToWall: "Back to {list} wall",
    remove: "Remove",
  },
  teaser: {
    aria: "Foil preview. Drag to scratch.",
    drag: "Drag to scratch",
    ritual: "That's the ritual.",
    ritualSub: "Now pick a list and scratch a real film.",
    chooseList: "Choose a list",
    tryAgain: "Try again",
    preview: "Preview foil",
    cleared: "{pct}% clear",
  },
  listsCopy: {
    "imdb-top": {
      description: "Scratch the wall. Track what you've seen.",
      tagline: "100 films. One poster wall.",
    },
    "oscar-winners": {
      description: "Gold statues. Fate still chooses.",
      tagline: "The gold list. One scratch.",
    },
    "turkish-cinema": {
      description: "Local posters. Anatolia under foil.",
      tagline: "Local wall. One scratch.",
    },
    "best-horror": {
      description: "Lights down. Pulse up.",
      tagline: "Don't look away. Scratch.",
    },
    "best-sci-fi": {
      description: "Other worlds. One ticket.",
      tagline: "Other worlds. One ticket.",
    },
    "best-animation": {
      description: "Not cartoons. Cinema.",
      tagline: "Every frame a world.",
    },
    "best-action": {
      description: "High pulse. Thin foil.",
      tagline: "Scratch. Detonate.",
    },
    "best-comedy": {
      description: "Laughing is a ritual too.",
      tagline: "Foil under laughs.",
    },
    "best-romance": {
      description: "Hearts get scratched too.",
      tagline: "One scratch. One story.",
    },
    "best-crime": {
      description: "Dark streets. Bright foil.",
      tagline: "Crime wall. Scratch.",
    },
    "best-thriller": {
      description: "Hold your breath. Scratch.",
      tagline: "Tension under foil.",
    },
    "best-war": {
      description: "The weight of war. The silence of the wall.",
      tagline: "Remember. Scratch.",
    },
    "best-fantasy": {
      description: "Dragons, rings, foil.",
      tagline: "Other realms. One scratch.",
    },
    "nolan-essentials": {
      description: "Time folds. You scratch.",
      tagline: "Time folds. You scratch.",
    },
    "tarantino-essentials": {
      description: "Dialogue. Blood. Foil.",
      tagline: "One director. One wall.",
    },
    "miyazaki-essentials": {
      description: "The wind rises. Foil opens.",
      tagline: "Ghibli spirit. Scratch.",
    },
    "spielberg-essentials": {
      description: "Wonder. Curiosity. Foil.",
      tagline: "Blockbuster ritual.",
    },
    "90s-classics": {
      description: "VHS energy. Foil destiny.",
      tagline: "Rewind the decade. Scratch once.",
    },
    "2000s-classics": {
      description: "New millennium. Old foil feel.",
      tagline: "2000–2009. Scratch.",
    },
    "2010s-hits": {
      description: "Shine of the last decade.",
      tagline: "2010–2019 wall.",
    },
  },
  listsCopyFallback: "Pick a card. Meet a film.",
};

export const tr: Messages = {
  nav: {
    home: "Ana sayfa",
    lists: "Listeler",
    watched: "İzlediklerim",
    lang: "Dil",
  },
  home: {
    brand: "SCRATCH",
    headlineLine1: "Stop scrolling.",
    headlineLine2: "Start scratching.",
    sub: "Ne izleyeceğine karar veremiyor musun? Duvarı kazı, filmi bul.",
    chooseList: "Liste seç",
    featuredCta: "Öne çıkanlar",
  },
  featured: {
    eyebrow: "Öne çıkan listeler",
    title: "Kazımaya değer dünyalar.",
    sub: "Buradan başla. Bir liste. Bir ritüel.",
    seeAll: "Tüm listeler",
  },
  lists: {
    eyebrow: "Liste seç",
    title: "Bir liste. Bir ritüel.",
    sub: "Bir dünya seç. Foil'i kazı. Filmini bul.",
    filmCount: "{count} film",
    enter: "Gir →",
  },
  intro: {
    titles: "{count} başlık",
    wallFallback: "Poster duvarı",
    listFallback: "Film listesi",
    taglineFallback: "Duvarı kazı. Filmlerini takip et.",
    body: "Duvarın her filmi burada. İzlediklerini kazı. İlerlemen geri döndüğünde duruyor.",
    openWall: "Duvarı aç",
    backLists: "Listelere dön",
  },
  wall: {
    loading: "Duvar yükleniyor…",
    revealed: "{count} / {total} açıldı",
    fallbackDemo: "Demo afişler — tam liste için TMDB_API_KEY gerekli.",
    back: "Geri",
    share: "İlerlemeyi paylaş",
    shared: "Paylaşıldı",
    copied: "Panoya kopyalandı",
    shareUnsupported: "Paylaşım desteklenmiyor",
    shareBody: "SCRATCH · {list}\n{count} / {total} açıldı\nKaydırma. Kazı.",
    reset: "İlerlemeyi sıfırla",
    resetting: "Sıfırlanıyor…",
    resetConfirm:
      "Bu listedeki tüm kazıma ilerlemesini sıfırlamak istiyor musun? Bu işlem geri alınamaz.",
    hint: "Duvarı kaydır · parayla kazı · ilerleme kaydedilir",
    error: "Poster duvarı yüklenemedi.",
    retry: "Tekrar dene",
    defaultDesc: "İzlediklerini kazı. İstediğin zaman geri dön.",
  },
  reveal: {
    stamped: "Açıldı · İzlediklerine eklendi",
    trailer: "Fragman",
    noTrailer: "Bu film için fragman bulunamadı.",
    backWall: "Duvara dön",
    watched: "İzlediklerim",
  },
  watched: {
    eyebrow: "Geçmiş",
    title: "İzlediklerim",
    sub: "Duvarı kazıyınca buraya düşer. İstediğini tek tek silebilirsin.",
    clearAll: "Tümünü sil",
    clearConfirm:
      "Tüm izleme geçmişini silmek istiyor musun? Bu işlem geri alınamaz.",
    empty: "Henüz damgalanmış film yok.",
    chooseList: "Liste seç",
    backToWall: "{list} duvarına dön",
    remove: "Kaldır",
  },
  teaser: {
    aria: "Foil önizleme. Kazımak için sürükle.",
    drag: "Kazımak için sürükle",
    ritual: "İşte ritüel bu.",
    ritualSub: "Şimdi bir liste seç ve gerçek bir filmi kazı.",
    chooseList: "Liste seç",
    tryAgain: "Tekrar dene",
    preview: "Önizleme foil",
    cleared: "{pct}% açıldı",
  },
  listsCopy: {
    "imdb-top": {
      description: "Duvarı kazı. İzlediklerini takip et.",
      tagline: "100 film. Tek poster duvarı.",
    },
    "oscar-winners": {
      description: "Altın heykeller. Kader yine seçer.",
      tagline: "Altın liste. Bir kazıma.",
    },
    "turkish-cinema": {
      description: "Yerli afişler. Foil altında Anadolu.",
      tagline: "Yerli duvar. Bir kazıma.",
    },
    "best-horror": {
      description: "Işıklar kısılsın. Nabız yükselsin.",
      tagline: "Gözünü ayırma. Kazı.",
    },
    "best-sci-fi": {
      description: "Başka dünyalar. Tek bilet.",
      tagline: "Başka dünyalar. Tek bilet.",
    },
    "best-animation": {
      description: "Çizgi değil. Sinema.",
      tagline: "Her kare bir dünya.",
    },
    "best-action": {
      description: "Nabız yüksek. Foil ince.",
      tagline: "Kazı. Patlasın.",
    },
    "best-comedy": {
      description: "Gülmek de bir ritüel.",
      tagline: "Foil altında kahkaha.",
    },
    "best-romance": {
      description: "Kalp kazınır.",
      tagline: "Bir kazıma. Bir hikâye.",
    },
    "best-crime": {
      description: "Karanlık sokaklar. Parlak foil.",
      tagline: "Suç duvarı. Kazı.",
    },
    "best-thriller": {
      description: "Nefesini tut. Kazı.",
      tagline: "Gerilim foil altında.",
    },
    "best-war": {
      description: "Savaşın ağırlığı. Duvarın sessizliği.",
      tagline: "Hatırla. Kazı.",
    },
    "best-fantasy": {
      description: "Ejderhalar, halkalar, foil.",
      tagline: "Başka diyar. Bir kazıma.",
    },
    "nolan-essentials": {
      description: "Zaman katlanır. Sen kazırsın.",
      tagline: "Zaman katlanır. Sen kazırsın.",
    },
    "tarantino-essentials": {
      description: "Diyalog. Kan. Foil.",
      tagline: "Bir yönetmen. Bir duvar.",
    },
    "miyazaki-essentials": {
      description: "Rüzgar eser. Foil açılır.",
      tagline: "Ghibli ruhu. Kazı.",
    },
    "spielberg-essentials": {
      description: "Hayret. Merak. Foil.",
      tagline: "Blockbuster ritüeli.",
    },
    "90s-classics": {
      description: "VHS enerjisi. Foil kaderi.",
      tagline: "On yılı geri sar. Bir kez kazı.",
    },
    "2000s-classics": {
      description: "Yeni milenyum. Eski foil hissi.",
      tagline: "2000–2009. Kazı.",
    },
    "2010s-hits": {
      description: "Son on yılın parıltısı.",
      tagline: "2010–2019 duvarı.",
    },
  },
  listsCopyFallback: "Bir kart seç. Bir filmle tanış.",
};

export const catalogs: Record<Locale, Messages> = { en, tr };

export function formatMessage(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? ""),
  );
}
