import { Router, type IRouter } from "express";
import { db, favoritesTable, productsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddFavoriteBody, RemoveFavoriteParams } from "@workspace/api-zod";
import { getUserIdFromRequest } from "./auth";

const router: IRouter = Router();

router.get("/favorites", async (req, res): Promise<void> => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const favorites = await db
    .select()
    .from(favoritesTable)
    .where(eq(favoritesTable.buyerId, userId))
    .orderBy(favoritesTable.createdAt);

  const result = await Promise.all(
    favorites.map(async (fav) => {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, fav.productId));
      const [supplier] = product
        ? await db.select().from(usersTable).where(eq(usersTable.id, product.supplierId))
        : [null];

      return {
        id: fav.id,
        buyerId: fav.buyerId,
        productId: fav.productId,
        product: product
          ? {
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
            }
          : null,
        createdAt: fav.createdAt.toISOString(),
      };
    })
  );

  res.json(result);
});

router.post("/favorites", async (req, res): Promise<void> => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = AddFavoriteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(favoritesTable)
    .where(and(eq(favoritesTable.buyerId, userId), eq(favoritesTable.productId, parsed.data.productId)));

  if (existing.length > 0) {
    res.status(400).json({ error: "Already in favorites" });
    return;
  }

  const [fav] = await db
    .insert(favoritesTable)
    .values({ buyerId: userId, productId: parsed.data.productId })
    .returning();

  res.status(201).json({
    id: fav.id,
    buyerId: fav.buyerId,
    productId: fav.productId,
    product: null,
    createdAt: fav.createdAt.toISOString(),
  });
});

router.delete("/favorites/:productId", async (req, res): Promise<void> => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const params = RemoveFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db
    .delete(favoritesTable)
    .where(and(eq(favoritesTable.buyerId, userId), eq(favoritesTable.productId, params.data.productId)));

  res.sendStatus(204);
});

export default router;
