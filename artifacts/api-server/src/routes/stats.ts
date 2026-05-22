import { Router, type IRouter } from "express";
import { db, usersTable, productsTable, rfqsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [suppliersResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "supplier"));

  const [buyersResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "buyer"));

  const [productsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(eq(productsTable.status, "active"));

  const [dealsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rfqsTable)
    .where(eq(rfqsTable.status, "contracted"));

  res.json({
    totalSuppliers: suppliersResult?.count ?? 0,
    totalBuyers: buyersResult?.count ?? 0,
    totalProducts: productsResult?.count ?? 0,
    totalDeals: dealsResult?.count ?? 0,
  });
});

router.get("/categories", async (_req, res): Promise<void> => {
  const categories = await db
    .select({
      name: productsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(productsTable)
    .where(eq(productsTable.status, "active"))
    .groupBy(productsTable.category)
    .orderBy(sql`count(*) DESC`);

  res.json(categories);
});

export default router;
