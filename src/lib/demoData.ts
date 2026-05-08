export type VerificationStatus = "NOT_VERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | "SUSPICIOUS";

export type PropertyType = "HOUSE" | "APARTMENT" | "LAND" | "OFFICE" | "SHOP" | "WAREHOUSE";

export type TransactionType = "RENT" | "SALE";

export type Property = {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  city: string;
  neighborhood: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  verificationStatus: VerificationStatus;
  trustScore?: number;
  postedBy: { kind: "agency" | "owner"; name: string };
};

export const DEMO_PROPERTIES: Property[] = [
  {
    id: "apt-haie-vive-2ch",
    title: "Appartement 2 chambres - Haie Vive",
    description:
      "Appartement lumineux et sécurisé, proche des commodités. Dossier vérifié ImoSafe (agence).",
    type: "APARTMENT",
    transactionType: "RENT",
    price: 250000,
    city: "Cotonou",
    neighborhood: "Haie Vive",
    address: "Haie Vive, Cotonou",
    bedrooms: 2,
    bathrooms: 2,
    area: 90,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    verificationStatus: "VERIFIED",
    trustScore: 90,
    postedBy: { kind: "agency", name: "ImoSafe Partners" },
  },
  {
    id: "villa-fidjrosse-4ch",
    title: "Villa 4 chambres - Fidjrossè",
    description:
      "Villa familiale avec jardin. Annonce en cours de vérification, visite recommandée avant tout paiement.",
    type: "HOUSE",
    transactionType: "SALE",
    price: 85000000,
    city: "Cotonou",
    neighborhood: "Fidjrossè",
    address: "Fidjrossè, Cotonou",
    bedrooms: 4,
    bathrooms: 3,
    area: 260,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    ],
    verificationStatus: "PENDING",
    trustScore: 68,
    postedBy: { kind: "owner", name: "Propriétaire vérifié" },
  },
  {
    id: "land-cocotomey",
    title: "Parcelle viabilisée - Cocotomey",
    description:
      "Terrain bien situé, accès facile. Attention: demande d’avance suspecte = signalez immédiatement.",
    type: "LAND",
    transactionType: "SALE",
    price: 12000000,
    city: "Calavi",
    neighborhood: "Cocotomey",
    address: "Cocotomey, Abomey-Calavi",
    area: 450,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    ],
    verificationStatus: "NOT_VERIFIED",
    trustScore: 42,
    postedBy: { kind: "owner", name: "Propriétaire" },
  },
  {
    id: "studio-cadjehoun",
    title: "Studio meublé - Cadjèhoun",
    description: "Studio meublé, idéal professionnel. Annonce signalée: informations à confirmer.",
    type: "APARTMENT",
    transactionType: "RENT",
    price: 180000,
    city: "Cotonou",
    neighborhood: "Cadjèhoun",
    address: "Cadjèhoun, Cotonou",
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    images: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    ],
    verificationStatus: "SUSPICIOUS",
    trustScore: 28,
    postedBy: { kind: "owner", name: "Contact non confirmé" },
  },
  {
    id: "shop-akpakpa",
    title: "Local commercial - Akpakpa",
    description: "Local pour boutique/atelier. Agence en cours de validation.",
    type: "SHOP",
    transactionType: "RENT",
    price: 300000,
    city: "Cotonou",
    neighborhood: "Akpakpa",
    address: "Akpakpa, Cotonou",
    area: 70,
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    ],
    verificationStatus: "PENDING",
    trustScore: 61,
    postedBy: { kind: "agency", name: "ImoSafe Partners" },
  },
  {
    id: "office-calavi",
    title: "Bureau moderne - Calavi",
    description: "Espace bureau moderne. Dossier rejeté (documents incomplets).",
    type: "OFFICE",
    transactionType: "RENT",
    price: 400000,
    city: "Calavi",
    neighborhood: "Calavi",
    address: "Calavi",
    area: 110,
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    ],
    verificationStatus: "REJECTED",
    trustScore: 36,
    postedBy: { kind: "agency", name: "ImoSafe Partners" },
  },
];

export const DEMO_AGENCIES = [
  {
    id: "imosafe-partners",
    name: "ImoSafe Partners",
    city: "Cotonou",
    address: "Haie Vive, Cotonou",
    verificationStatus: "VERIFIED" as const,
    phone: "+229 21 00 00 00",
  },
  {
    id: "agency-calavi",
    name: "Calavi Immo Pro",
    city: "Calavi",
    address: "Calavi",
    verificationStatus: "PENDING" as const,
    phone: "+229 90 00 00 10",
  },
];

export type StayAvailabilityStatus = "AVAILABLE" | "LIMITED" | "UNAVAILABLE";

export type Stay = {
  id: string;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  addressApprox?: string;
  pricePerNight: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  cleaningFee?: number;
  deposit?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  availabilityStatus: StayAvailabilityStatus;
  verificationStatus: VerificationStatus;
  hostName: string;
  hostVerified: boolean;
  photosVerified: boolean;
  trustScore?: number;
  checkInTime?: string;
  checkOutTime?: string;
  rules: string[];
};

export const DEMO_STAYS: Stay[] = [
  {
    id: "stay-fidjrosse-meuble",
    title: "Appartement meublé - Fidjrossè",
    description:
      "Appartement meublé tout confort, proche plage et commerces. Photos et hôte vérifiés (démo).",
    city: "Cotonou",
    neighborhood: "Fidjrossè",
    addressApprox: "Fidjrossè (zone plage)",
    pricePerNight: 32000,
    pricePerWeek: 190000,
    pricePerMonth: 680000,
    cleaningFee: 8000,
    deposit: 50000,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Wi‑Fi", "Climatisation", "Cuisine équipée", "Sécurité", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
    ],
    availabilityStatus: "AVAILABLE",
    verificationStatus: "VERIFIED",
    hostName: "Awa K.",
    hostVerified: true,
    photosVerified: true,
    trustScore: 92,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    rules: ["Pas de fête", "Pièce d’identité requise", "Respect du voisinage"],
  },
  {
    id: "stay-haie-vive-studio",
    title: "Studio moderne - Haie Vive",
    description:
      "Studio moderne, idéal court séjour. Quartier calme. Hôte vérifié, photos en cours de validation (démo).",
    city: "Cotonou",
    neighborhood: "Haie Vive",
    addressApprox: "Haie Vive (proche axes principaux)",
    pricePerNight: 25000,
    pricePerWeek: 150000,
    pricePerMonth: 520000,
    cleaningFee: 6000,
    deposit: 40000,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    amenities: ["Wi‑Fi", "Climatisation", "Eau chaude", "Gardien"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1560448071-6d89f0a0c2f0?auto=format&fit=crop&w=1400&q=80",
    ],
    availabilityStatus: "LIMITED",
    verificationStatus: "PENDING",
    hostName: "Romain S.",
    hostVerified: true,
    photosVerified: false,
    trustScore: 74,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    rules: ["Non fumeur", "Pas d’animaux"],
  },
  {
    id: "stay-calavi-famille",
    title: "Résidence familiale - Calavi",
    description:
      "Résidence spacieuse pour familles, jardin et espace de travail. Logement en cours de vérification (démo).",
    city: "Calavi",
    neighborhood: "Calavi",
    addressApprox: "Calavi (zone résidentielle)",
    pricePerNight: 45000,
    pricePerWeek: 270000,
    pricePerMonth: 920000,
    cleaningFee: 10000,
    deposit: 80000,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Wi‑Fi", "Climatisation", "Cuisine équipée", "Jardin", "Sécurité"],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80",
    ],
    availabilityStatus: "AVAILABLE",
    verificationStatus: "PENDING",
    hostName: "Famille H.",
    hostVerified: false,
    photosVerified: false,
    trustScore: 58,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    rules: ["Respect du voisinage", "Pas de musique forte après 22h"],
  },
  {
    id: "stay-cocotomey-villa-courte-duree",
    title: "Villa courte durée - Cocotomey",
    description:
      "Villa pour séjours courts avec grande terrasse. Prix attractif: prudence et vérification recommandées (démo).",
    city: "Calavi",
    neighborhood: "Cocotomey",
    addressApprox: "Cocotomey (accès facile)",
    pricePerNight: 28000,
    pricePerWeek: 165000,
    pricePerMonth: 600000,
    cleaningFee: 7000,
    deposit: 60000,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Wi‑Fi", "Terrasse", "Cuisine équipée", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
    ],
    availabilityStatus: "LIMITED",
    verificationStatus: "SUSPICIOUS",
    hostName: "Hôte anonyme",
    hostVerified: false,
    photosVerified: false,
    trustScore: 33,
    checkInTime: "13:00",
    checkOutTime: "11:00",
    rules: ["Aucun paiement hors canal vérifié", "Vérifier disponibilité avant déplacement"],
  },
];
