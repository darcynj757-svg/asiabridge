import { Router, type IRouter } from "express";
import { db, rfqsTable, productsTable, usersTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import {
  CreateRfqBody,
  UpdateRfqBody,
  UpdateRfqParams,
  GetRfqParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function serializeRfq(rfq: typeof rfqsTable.$inferSelect) {
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, rfq.productId));
  const [buyer] = await db.select().from(usersTable).where(eq(usersTable.id, rfq.buyerId));
  const [supplier] = await db.select().from(usersTable).where(eq(usersTable.id, rfq.supplierId));

  return {
    id: rfq.id,
    buyerId: rfq.buyerId,
    productId: rfq.productId,
    supplierId: rfq.supplierId,
    productTitle: product?.title ?? null,
    buyerName: buyer?.companyName ?? buyer?.email ?? null,
    supplierName: supplier?.companyName ?? supplier?.email ?? null,
    quantity: rfq.quantity,
    message: rfq.message,
    status: rfq.status,
    createdAt: rfq.createdAt.toISOString(),
  };
}

router.get("/rfqs", async (req, res): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const rfqs = await db
    .select()
    .from(rfqsTable)
    .where(or(eq(rfqsTable.buyerId, userId), eq(rfqsTable.supplierId, userId)))
    .orderBy(rfqsTable.createdAt);

  const serialized = await Promise.all(rfqs.map(serializeRfq));
  res.json(serialized);
});

router.post("/rfqs", async (req, res): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = CreateRfqBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [rfq] = await db
    .insert(rfqsTable)
    .values({ ...parsed.data, buyerId: userId })
    .returning();

  const serialized = await serializeRfq(rfq);
  res.status(201).json(serialized);
});

router.get("/rfqs/:id", async (req, res): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const params = GetRfqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [rfq] = await db.select().from(rfqsTable).where(eq(rfqsTable.id, params.data.id));
  if (!rfq) {
    res.status(404).json({ error: "RFQ not found" });
    return;
  }

  if (rfq.buyerId !== userId && rfq.supplierId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json(await serializeRfq(rfq));
});

router.patch("/rfqs/:id", async (req, res): Promise<void> => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const params = UpdateRfqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateRfqBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(rfqsTable).where(eq(rfqsTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "RFQ not found" });
    return;
  }

  if (existing.buyerId !== userId && existing.supplierId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [rfq] = await db
    .update(rfqsTable)
    .set(parsed.data)
    .where(eq(rfqsTable.id, params.data.id))
    .returning();

  res.json(await serializeRfq(rfq));
});

export default router;
