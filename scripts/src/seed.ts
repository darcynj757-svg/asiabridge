import { db, usersTable, productsTable, rfqsTable, messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const supplierHash = await bcrypt.hash("supplier123", 10);
  const buyerHash = await bcrypt.hash("buyer123", 10);

  // Admin
  const [admin] = await db
    .insert(usersTable)
    .values({ email: "admin@asiabridge.com", passwordHash: adminHash, role: "admin", companyName: "AsiaBridge", country: "Russia", category: "Administration" })
    .onConflictDoNothing()
    .returning();

  // Suppliers
  const [supplier1] = await db
    .insert(usersTable)
    .values({
      email: "ivan@rusmach.ru",
      passwordHash: supplierHash,
      role: "supplier",
      companyName: "RusMach Engineering",
      companyDescription: "Leading Russian manufacturer of industrial machinery and CNC equipment for export markets since 1995.",
      country: "Russia",
      category: "Machinery & Equipment",
      contactPhone: "+7 495 123 4567",
      contactWebsite: "https://rusmach.ru",
    })
    .onConflictDoNothing()
    .returning();

  const [supplier2] = await db
    .insert(usersTable)
    .values({
      email: "mikhail@agro-export.ru",
      passwordHash: supplierHash,
      role: "supplier",
      companyName: "AgroExport Rus",
      companyDescription: "Premium Russian agricultural products exporter specializing in grains, oils and processed food.",
      country: "Russia",
      category: "Food & Beverages",
      contactPhone: "+7 812 987 6543",
    })
    .onConflictDoNothing()
    .returning();

  const [supplier3] = await db
    .insert(usersTable)
    .values({
      email: "dmitry@chemplus.ru",
      passwordHash: supplierHash,
      role: "supplier",
      companyName: "ChemPlus Russia",
      companyDescription: "Russian chemical and polymer products exporter, ISO 9001 certified, serving Asian markets since 2008.",
      country: "Russia",
      category: "Chemicals",
      contactPhone: "+7 495 333 2211",
    })
    .onConflictDoNothing()
    .returning();

  // Buyers
  const [buyer1] = await db
    .insert(usersTable)
    .values({
      email: "sovann@khmer-import.kh",
      passwordHash: buyerHash,
      role: "buyer",
      companyName: "Khmer Import Co.",
      companyDescription: "Leading Cambodian importer of industrial equipment and construction materials.",
      country: "Cambodia",
      category: "Machinery & Equipment",
      contactPhone: "+855 12 345 678",
    })
    .onConflictDoNothing()
    .returning();

  const [buyer2] = await db
    .insert(usersTable)
    .values({
      email: "priya@thai-goods.th",
      passwordHash: buyerHash,
      role: "buyer",
      companyName: "Thai Global Trading",
      companyDescription: "Bangkok-based trading company importing food products and chemicals from Russia and CIS countries.",
      country: "Thailand",
      category: "Food & Beverages",
    })
    .onConflictDoNothing()
    .returning();

  const s1Id = supplier1?.id ?? (await db.select().from(usersTable).where(eq(usersTable.email, "ivan@rusmach.ru")))[0].id;
  const s2Id = supplier2?.id ?? (await db.select().from(usersTable).where(eq(usersTable.email, "mikhail@agro-export.ru")))[0].id;
  const s3Id = supplier3?.id ?? (await db.select().from(usersTable).where(eq(usersTable.email, "dmitry@chemplus.ru")))[0].id;
  const b1Id = buyer1?.id ?? (await db.select().from(usersTable).where(eq(usersTable.email, "sovann@khmer-import.kh")))[0].id;
  const b2Id = buyer2?.id ?? (await db.select().from(usersTable).where(eq(usersTable.email, "priya@thai-goods.th")))[0].id;

  console.log("Users:", { s1Id, s2Id, s3Id, b1Id, b2Id });

  // Products
  const products = await db
    .insert(productsTable)
    .values([
      {
        supplierId: s1Id,
        title: "CNC Milling Machine RM-500",
        description: "High-precision CNC milling machine for industrial use. 5-axis capability, spindle speed 12000 RPM, working area 500×400×300mm. Suitable for metal, plastic, and composite materials.",
        price: 18500,
        currency: "USD",
        moq: 1,
        unit: "unit",
        category: "Machinery & Equipment",
        originCountry: "Russia",
        images: [],
        certificates: "CE, ISO 9001",
        status: "active",
      },
      {
        supplierId: s1Id,
        title: "Industrial Hydraulic Press HP-200T",
        description: "200-ton hydraulic press for heavy industrial applications. Automatic control system, adjustable pressure, suitable for metal forming and stamping operations.",
        price: 45000,
        currency: "USD",
        moq: 1,
        unit: "unit",
        category: "Machinery & Equipment",
        originCountry: "Russia",
        images: [],
        certificates: "CE, GOST R",
        status: "active",
      },
      {
        supplierId: s1Id,
        title: "Electric Motor EMR-90kW",
        description: "Industrial three-phase electric motor, 90 kW output, IE3 efficiency class. IP65 protection, suitable for harsh industrial environments.",
        price: 3200,
        currency: "USD",
        moq: 5,
        unit: "unit",
        category: "Machinery & Equipment",
        originCountry: "Russia",
        images: [],
        certificates: "CE, GOST, EAC",
        status: "active",
      },
      {
        supplierId: s2Id,
        title: "Premium Sunflower Oil (Refined)",
        description: "First-grade refined sunflower oil, deodorized, suitable for food production. Complies with international food safety standards. Available in bulk tankers or 1L/5L bottles.",
        price: 1.2,
        currency: "USD",
        moq: 1000,
        unit: "liter",
        category: "Food & Beverages",
        originCountry: "Russia",
        images: [],
        certificates: "ISO 22000, Halal, Kosher",
        status: "active",
      },
      {
        supplierId: s2Id,
        title: "Hard Red Winter Wheat",
        description: "Premium quality hard red winter wheat. Protein content 12.5%+, moisture max 13%. Suitable for bread and pasta production. Available for export with phytosanitary certification.",
        price: 285,
        currency: "USD",
        moq: 100,
        unit: "ton",
        category: "Food & Beverages",
        originCountry: "Russia",
        images: [],
        certificates: "Phytosanitary, Export License",
        status: "active",
      },
      {
        supplierId: s2Id,
        title: "Buckwheat Groats (Roasted)",
        description: "Premium Russian buckwheat groats, roasted, grade 1. Rich in protein and minerals. Packaged in 25kg bags or 1000kg big bags. GMO-free.",
        price: 850,
        currency: "USD",
        moq: 20,
        unit: "ton",
        category: "Food & Beverages",
        originCountry: "Russia",
        images: [],
        certificates: "ISO 22000, Organic",
        status: "active",
      },
      {
        supplierId: s3Id,
        title: "NPK Fertilizer 16-16-16",
        description: "Balanced compound fertilizer NPK 16-16-16. Suitable for all crop types. Granulated form for easy application. Available in 50kg bags or bulk.",
        price: 420,
        currency: "USD",
        moq: 25,
        unit: "ton",
        category: "Chemicals",
        originCountry: "Russia",
        images: [],
        certificates: "ISO 9001, EAC",
        status: "active",
      },
      {
        supplierId: s3Id,
        title: "Polyethylene Granules HDPE",
        description: "High-density polyethylene (HDPE) granules, grade 276-73. Suitable for film, pipe and injection molding applications. MFI 0.2-0.3 g/10min.",
        price: 1150,
        currency: "USD",
        moq: 20,
        unit: "ton",
        category: "Chemicals",
        originCountry: "Russia",
        images: [],
        certificates: "ISO 9001, REACH",
        status: "active",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log("Products seeded:", products.length);

  if (products.length > 0) {
    // Seed a sample RFQ
    const [rfq] = await db
      .insert(rfqsTable)
      .values({
        buyerId: b1Id,
        productId: products[0].id,
        supplierId: s1Id,
        quantity: 2,
        message: "We are interested in purchasing 2 units of your CNC Milling Machine for our manufacturing facility in Phnom Penh. Please provide your best export price and delivery timeline.",
        status: "quoted",
      })
      .returning();

    if (rfq) {
      await db.insert(messagesTable).values([
        { rfqId: rfq.id, senderId: b1Id, content: "Hello! We are interested in purchasing 2 units of your CNC Milling Machine. Can you provide FOB price and delivery terms?" },
        { rfqId: rfq.id, senderId: s1Id, content: "Dear partner, thank you for your inquiry. We can offer 2 units at $18,500 each FOB Vladivostok. Delivery time is 45 working days after payment confirmation. We accept L/C and T/T." },
        { rfqId: rfq.id, senderId: b1Id, content: "Thank you. We would prefer CIF Sihanoukville port. Can you provide shipping cost estimate and technical documentation?" },
      ]);
      console.log("RFQ and messages seeded");
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
