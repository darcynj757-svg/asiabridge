import { Router, type IRouter } from "express";
import { db, productsTable, usersTable } from "@workspace/db";
import { eq, and, ilike, gte, lte, sql } from "drizzle-orm";
import {
  CreateProductBody,
  UpdateProductBody,
  UpdateProductParams,
  GetProductParams,
  DeleteProductParams,
  ListProductsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeProduct(product: typeof productsTable.$inferSelect, supplier?: typeof usersTable.$inferSelect | null) {
  return {
    id: product.id,
    supplierId: product.supplierId,
    supplierName: supplier?.companyName ?? null,
    supplierCountry: supplier?.country ?? null,
    title: product.title,
    description: product.description,
    price: product.price,
    currency: product.currency,
    moq: product.moq,
    unit: product.unit,
    category: product.category,
    originCountry: product.originCountry,
    images: product.images ?? [],
    certificates: product.certificates,
    status: product.status,
    createdAt: product.createdAt.toISOString(),
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const params = ListProductsQueryParams.safeParse(req.query);
  const q = params.success ? params.data : {};

  const conditions = [eq(productsTable.status, "active")];

  if (q.category) conditions.push(eq(productsTable.category, q.category));
  if (q.country) conditions.push(eq(productsTable.originCountry, q.country));
  if (q.search) conditions.push(ilike(productsTable.title, `%${q.search}%`));
  if (q.minPrice !== undefined) conditions.push(gte(productsTable.price, q.minPrice));
  if (q.maxPrice !== undefined) conditions.push(lte(productsTable.price, q.maxPrice));
  if (q.supplierId !== undefined) {
    const supplierId = typeof q.supplierId === "string" ? parseInt(q.supplierId, 10) : q.supplierId;
    conditions.push(eq(productsTable.supplierId, supplierId));
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(and(...conditions))
    .orderBy(productsTable.createdAt);

  const supplierIds = [...new Set(products.map((p) => p.supplierId))];
  const suppliers = supplierIds.length > 0
    ? await db.select().from(usersTable).where(sql`${usersTable.id} = ANY(${sql.raw(`ARRAY[${supplierIds.join(",")}]`)})`)
    : [];

  const supplierMap = new Map(suppliers.map((s) => [s.id, s]));

  res.json(products.map((p) => serializeProduct(p, supplierMap.get(p.supplierId))));
});

router.post("/products", async (req, res): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db
    .insert(productsTable)
    .values({ ...parsed.data, supplierId: userId })
    .returning();

  res.status(201).json(serializeProduct(product));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [supplier] = await db.select().from(usersTable).where(eq(usersTable.id, product.supplierId));
  res.json(serializeProduct(product, supplier));
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!existing || existing.supplierId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [product] = await db
    .update(productsTable)
    .set(parsed.data)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  const [supplier] = await db.select().from(usersTable).where(eq(usersTable.id, product.supplierId));
  res.json(serializeProduct(product, supplier));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!existing || existing.supplierId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
