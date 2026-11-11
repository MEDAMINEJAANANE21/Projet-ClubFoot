interface ChapterImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly caption: string;
}

/** Un chapitre affiche soit une photo, soit un grand repère texte (année, numéro). */
export interface Chapter {
  readonly id: string;
  readonly shortLabel: string;
  readonly years: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly image?: ChapterImage;
  readonly marker?: string;
  readonly highlight?: { readonly title: string; readonly text: string };
}

export const HISTORY_CHAPTERS: readonly Chapter[] = [
  {
    id: 'origines',
    shortLabel: '1937',
    years: '1937 – 1939',
    title: "La naissance d'un club",
    image: {
      src: 'images/histoire/mohamed-benjelloun-touimi.webp',
      alt: 'Portrait de Mohamed Benjelloun Touimi',
      width: 290,
      height: 290,
      caption: 'Mohamed Benjelloun Touimi, fondateur et premier président du Wydad',
    },
    paragraphs: [
      "Le Wydad Athletic Club, aussi appelé Wydad ou WAC, est fondé en 1937 à Casablanca, pendant le protectorat français. Ses créateurs sont un groupe d'intellectuels et de jeunes résistants, parmi lesquels feu Mohamed Benjelloun Touimi.",
      'Le club commence par une section de water-polo. La section football voit le jour en 1939, avec le soutien du Père Jégo.',
      "Ses couleurs sont le rouge et le blanc. Il joue ses matchs à domicile au stade Mohammed V, que les supporters appellent encore « le Donor » ou le stade d'Honneur.",
    ],
  },
  {
    id: 'premiers-titres',
    shortLabel: '1939–1956',
    years: '1939 – 1956',
    title: 'Les premiers titres',
    image: {
      src: 'images/histoire/equipe-1939-1940.webp',
      alt: "Photo d'équipe du Wydad, en noir et blanc, lors de la saison 1939-1940",
      width: 300,
      height: 196,
      caption: "L'équipe du Wydad lors de sa première saison, en 1939-1940",
    },
    paragraphs: [
      "Le club monte vite. Il accède à la première division du championnat marocain dès 1942 et remporte son premier grand titre en 1948, qu'il conserve pendant quatre saisons.",
      "Sur la même période, le Wydad domine aussi le football maghrébin : trois Championnats d'Afrique du Nord, deux Supercoupes d'Afrique du Nord et une Coupe d'Afrique du Nord.",
    ],
    highlight: { title: '4 titres de suite', text: 'Champion du Maroc chaque saison de 1948 à 1951' },
  },
  {
    id: 'independance',
    shortLabel: '1956–1970',
    years: '1956 – 1970',
    title: "L'indépendance",
    marker: 'N°1',
    paragraphs: [
      "En 1956, le Maroc obtient son indépendance. Le Wydad devient le premier club enregistré à la Fédération royale marocaine de football, avec le numéro d'immatriculation 1. Le 9 décembre 1956, il remporte la Coupe de l'Indépendance à Tanger face au FC Maghreb Al Aqsa, grâce à un but d'Abdelhak Kadmiri.",
      "Jusqu'en 1969, le club ajoute huit championnats à son palmarès. La Coupe du Trône, elle, lui échappe malgré quatre finales. Celle de 1957 reste controversée : la coupe est attribuée au Mouloudia d'Oujda parce qu'il a marqué en premier, alors que le match s'est terminé sur un nul 1-1. Le règlement de l'époque prévoyait pourtant un match à rejouer.",
      "En 1969-1970, le Wydad élimine le Hassania d'Agadir, le Difaâ Hassani El Jadidi puis le Maghreb de Fès en demi-finale (1-1, puis 1-0 au match rejoué). En finale, il affronte la Renaissance de Settat au stade d'Honneur, devant ses supporters et en présence du roi Hassan II. Au coup de sifflet final, le Wydad soulève enfin sa première Coupe du Trône.",
    ],
    highlight: {
      title: '9 Coupes du Trône',
      text: 'Huit autres après celle de 1970, la dernière en 2001',
    },
  },
  {
    id: 'coupe-mohammed-v',
    shortLabel: '1970–1989',
    years: '1970 – 1989',
    title: "Face aux grands d'Europe",
    image: {
      src: 'images/histoire/coupe-mohammed-v-1979.webp',
      alt: 'Larbi Aherdane porte le trophée de la Coupe Mohammed V, entouré de joueurs',
      width: 565,
      height: 357,
      caption: 'Larbi Aherdane porte le trophée de la Coupe Mohammed V, en 1979',
    },
    paragraphs: [
      'Avec ses titres nationaux et maghrébins, le Wydad voit plus grand. Il affronte de grands clubs étrangers, notamment lors de la Coupe Mohammed V, un tournoi international organisé à Casablanca.',
      "Pour sa première participation, il perd de justesse 2-0 contre le Real Madrid. Suivent le Slovan Bratislava, le Bayern Munich, São Paulo, Aguila, Anderlecht, le Sporting Portugal, la sélection roumaine, Everton et Monaco. Le club croise aussi des équipes africaines et marocaines : le Hafia Conakry, l'AS FAR, l'ASC Jeanne d'Arc de Dakar et le Canon Yaoundé, qu'il bat en finale en 1979.",
    ],
    highlight: {
      title: 'Vainqueur en 1979',
      text: "Seul club hors d'Europe et d'Amérique latine à avoir remporté la Coupe Mohammed V, disparue en 1989",
    },
  },
  {
    id: 'age-d-or',
    shortLabel: '1989–1993',
    years: '1989 – 1993',
    title: "L'âge d'or",
    image: {
      src: 'images/histoire/ligue-champions-1992.webp',
      alt: "Fakhreddine Rajhi soulève la Coupe d'Afrique des clubs champions",
      width: 500,
      height: 362,
      caption: "Fakhreddine Rajhi soulève la Coupe d'Afrique des clubs champions, en 1992",
    },
    paragraphs: [
      'Entre 1989 et 1993, le club vit sa première grande période de succès. Il remporte trois championnats, une Coupe du Trône, une Ligue des champions arabe et une Supercoupe arabe.',
      "Surtout, il gagne sa première Ligue des champions africaine en 1992 face au Hilal du Soudan : victoire 2-0 à Casablanca à l'aller, puis 0-0 au retour à Omdourman.",
      "Ces titres récompensent le travail d'Abderrazak Mekouar, président de 1972 à 1993. Il modernise la gestion du club et influence tout le football marocain. Sous sa présidence, le Wydad devient la première équipe marocaine à rémunérer ses joueurs.",
      "Fin 1993, Mekouar quitte la présidence. Plusieurs joueurs partent aussi : à l'étranger, à la retraite ou dans d'autres clubs marocains.",
    ],
  },
  {
    id: 'renaissance',
    shortLabel: '1993–2014',
    years: '1993 – 2014',
    title: 'Doutes et renaissance',
    marker: '2002',
    paragraphs: [
      "S'ouvre alors une période de renouveau, mais aussi de doute. Le Raja Casablanca, l'autre grand club de la ville, en profite pour dominer le championnat de 1996 à 2001 et gagner la Ligue des champions africaine en 1997 et en 1999.",
      "Le Wydad remporte pendant ce temps quatre Coupes du Trône, dont celle de 2001. Ce titre le qualifie pour la Coupe d'Afrique des vainqueurs de coupe, qu'il gagne en 2002 contre l'Asante Kotoko : victoire 1-0 à Casablanca, défaite 2-1 à Kumasi, au Ghana, et qualification grâce au but marqué à l'extérieur.",
      "Entre 2003 et 2014, le club traverse une période d'instabilité. Il retrouve pourtant le titre de champion en 2005-2006, le premier depuis 13 ans. C'est aussi la saison de naissance des Ultras Winners, devenus des acteurs majeurs du club et régulièrement cités parmi les meilleures tribunes du monde.",
      "Nouveau titre en 2010, au terme d'un suspense total : il faut attendre la 30ᵉ et dernière journée, une victoire contre le FUS de Rabat et une défaite du Raja face à l'AS FAR pour que le Wydad passe premier.",
    ],
  },
  {
    id: 'ere-moderne',
    shortLabel: 'Depuis 2014',
    years: 'Depuis 2014',
    title: "L'ère moderne",
    image: {
      src: 'images/histoire/akram-et-naciri.webp',
      alt: 'Abdelilah Akram et Said Naciri assis à une table de conférence devant le logo du club',
      width: 600,
      height: 360,
      caption: 'Abdelilah Akram (à gauche) et Said Naciri, son successeur à la présidence en 2014',
    },
    paragraphs: [
      'En 2014, Said Naciri est élu président. Il succède à Abdelilah Akram, poussé au départ par le boycott des supporters, qui critiquaient sa gestion.',
      "Sa gestion, autoritaire mais efficace, rend au club sa stabilité. Le Wydad redevient un grand d'Afrique : cinq championnats entre 2015 et 2022, et deux nouvelles Ligues des champions africaines.",
      "La première est gagnée en 2017 avec Houcine Ammouta. La seconde en 2022 avec Walid Regragui, qui prend ensuite la tête de l'équipe nationale et emmène le Maroc en demi-finale de la Coupe du monde 2022 au Qatar.",
      'Fin 2023, Said Naciri quitte la présidence. En 2025, le Wydad représente le Maroc à la Coupe du monde des clubs de la FIFA, aux États-Unis.',
    ],
    highlight: { title: '3 Ligues des champions', text: '1992, 2017 et 2022' },
  },
];
