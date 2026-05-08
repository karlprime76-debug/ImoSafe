import { PrismaClient, PropertyStatus, PropertyType, TransactionType, UserRole, VerificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@imosafe.test" },
    update: { name: "Admin ImoSafe", passwordHash, role: UserRole.ADMIN },
    create: { name: "Admin ImoSafe", email: "admin@imosafe.test", passwordHash, role: UserRole.ADMIN },
  });

  const agencyOwner = await prisma.user.upsert({
    where: { email: "agency@imosafe.test" },
    update: { name: "Agence Haie Vive", passwordHash, role: UserRole.AGENCY, phone: "+229 90 00 00 01" },
    create: {
      name: "Agence Haie Vive",
      email: "agency@imosafe.test",
      passwordHash,
      role: UserRole.AGENCY,
      phone: "+229 90 00 00 01",
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@imosafe.test" },
    update: { name: "Propriétaire Cadjèhoun", passwordHash, role: UserRole.OWNER, phone: "+229 90 00 00 02" },
    create: {
      name: "Propriétaire Cadjèhoun",
      email: "owner@imosafe.test",
      passwordHash,
      role: UserRole.OWNER,
      phone: "+229 90 00 00 02",
    },
  });

  const agency = await prisma.agency.upsert({
    where: { id: "demo-agency" },
    update: {
      name: "ImoSafe Partners",
      phone: "+229 21 00 00 00",
      email: "contact@imosafe.partners",
      address: "Haie Vive, Cotonou",
      verificationStatus: VerificationStatus.VERIFIED,
      ownerId: agencyOwner.id,
    },
    create: {
      id: "demo-agency",
      name: "ImoSafe Partners",
      phone: "+229 21 00 00 00",
      email: "contact@imosafe.partners",
      address: "Haie Vive, Cotonou",
      verificationStatus: VerificationStatus.VERIFIED,
      ownerId: agencyOwner.id,
    },
  });

  await prisma.property.deleteMany({
    where: {
      OR: [{ city: "Cotonou" }, { city: "Calavi" }],
    },
  });

  await prisma.property.createMany({
    data: [
      {
        title: "Appartement 2 chambres - Haie Vive",
        description:
          "Appartement lumineux et sécurisé, proche des commodités. Dossier vérifié ImoSafe (agence).",
        type: PropertyType.APARTMENT,
        transactionType: TransactionType.RENT,
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
        status: PropertyStatus.AVAILABLE,
        verificationStatus: VerificationStatus.VERIFIED,
        agencyId: agency.id,
      },
      {
        title: "Villa 4 chambres - Fidjrossè",
        description:
          "Villa familiale avec jardin. Annonce en cours de vérification, visite recommandée avant tout paiement.",
        type: PropertyType.HOUSE,
        transactionType: TransactionType.SALE,
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
        status: PropertyStatus.AVAILABLE,
        verificationStatus: VerificationStatus.PENDING,
        ownerId: owner.id,
      },
      {
        title: "Parcelle viabilisée - Cocotomey",
        description:
          "Terrain bien situé, accès facile. Attention: demande d’avance suspecte = signalez immédiatement.",
        type: PropertyType.LAND,
        transactionType: TransactionType.SALE,
        price: 12000000,
        city: "Calavi",
        neighborhood: "Cocotomey",
        address: "Cocotomey, Abomey-Calavi",
        area: 450,
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        ],
        status: PropertyStatus.AVAILABLE,
        verificationStatus: VerificationStatus.NOT_VERIFIED,
        ownerId: owner.id,
      },
      {
        title: "Studio meublé - Cadjèhoun",
        description:
          "Studio meublé, idéal professionnel. Annonce signalée: informations à confirmer.",
        type: PropertyType.APARTMENT,
        transactionType: TransactionType.RENT,
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
        status: PropertyStatus.AVAILABLE,
        verificationStatus: VerificationStatus.SUSPICIOUS,
        ownerId: owner.id,
      },
      {
        title: "Local commercial - Akpakpa",
        description:
          "Local pour boutique/atelier. Agence en cours de validation.",
        type: PropertyType.SHOP,
        transactionType: TransactionType.RENT,
        price: 300000,
        city: "Cotonou",
        neighborhood: "Akpakpa",
        address: "Akpakpa, Cotonou",
        area: 70,
        images: [
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
        ],
        status: PropertyStatus.AVAILABLE,
        verificationStatus: VerificationStatus.PENDING,
        agencyId: agency.id,
      },
      {
        title: "Bureau moderne - Calavi",
        description:
          "Espace bureau moderne. Dossier rejeté (documents incomplets).",
        type: PropertyType.OFFICE,
        transactionType: TransactionType.RENT,
        price: 400000,
        city: "Calavi",
        neighborhood: "Calavi",
        address: "Calavi",
        area: 110,
        images: [
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
        ],
        status: PropertyStatus.HIDDEN,
        verificationStatus: VerificationStatus.REJECTED,
        agencyId: agency.id,
      },
    ],
  });

  console.log("Seed completed.");
  console.log("Demo accounts:");
  console.log("- admin@imosafe.test / Password123!");
  console.log("- agency@imosafe.test / Password123!");
  console.log("- owner@imosafe.test / Password123!");
  console.log("(Set DATABASE_URL and run prisma:migrate then prisma:seed)");
  void admin;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
