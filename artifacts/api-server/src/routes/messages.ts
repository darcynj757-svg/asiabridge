import { Router, type IRouter } from "express";
import { db, messagesTable, rfqsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateMessageBody, CreateMessageParams, ListMessagesParams } from "@workspace/api-zod";
import { getUserIdFromRequest } from "./auth";

const router: IRouter = Router();

router.get("/rfqs/:id/messages", async (req, res): Promise<void> => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const params = ListMessagesParams.safeParse(req.params);
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

  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.rfqId, params.data.id))
    .orderBy(messagesTable.createdAt);

  const senderIds = [...new Set(messages.map((m) => m.senderId))];
  const senders = senderIds.length > 0
    ? await db.select().from(usersTable).where(
        eq(usersTable.id, senderIds[0])
      )
    : [];

  const allSenders: typeof usersTable.$inferSelect[] = [];
  for (const sid of senderIds) {
    const [s] = await db.select().from(usersTable).where(eq(usersTable.id, sid));
    if (s) allSenders.push(s);
  }

  const senderMap = new Map(allSenders.map((s) => [s.id, s]));

  const serialized = messages.map((msg) => {
    const sender = senderMap.get(msg.senderId);
    return {
      id: msg.id,
      rfqId: msg.rfqId,
      senderId: msg.senderId,
      senderName: sender?.companyName ?? sender?.email ?? null,
      senderRole: sender?.role ?? null,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    };
  });

  res.json(serialized);
});

router.post("/rfqs/:id/messages", async (req, res): Promise<void> => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const pathParams = CreateMessageParams.safeParse(req.params);
  if (!pathParams.success) {
    res.status(400).json({ error: pathParams.error.message });
    return;
  }

  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [rfq] = await db.select().from(rfqsTable).where(eq(rfqsTable.id, pathParams.data.id));
  if (!rfq) {
    res.status(404).json({ error: "RFQ not found" });
    return;
  }

  if (rfq.buyerId !== userId && rfq.supplierId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const [message] = await db
    .insert(messagesTable)
    .values({ rfqId: pathParams.data.id, senderId: userId, content: parsed.data.content })
    .returning();

  const [sender] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  res.status(201).json({
    id: message.id,
    rfqId: message.rfqId,
    senderId: message.senderId,
    senderName: sender?.companyName ?? sender?.email ?? null,
    senderRole: sender?.role ?? null,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  });
});

export default router;
