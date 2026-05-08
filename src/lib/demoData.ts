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
