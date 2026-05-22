import { Router, type IRouter } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "asiabridge-secret-key";
const COOKIE_NAME = "ab_token";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const behindHttpsProxy = !!(process.env.REPLIT_DEV_DOMAIN || process.env.NODE_ENV === "production");

function setCookie(res: any, userId: number) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: behindHttpsProxy,
    sameSite: behindHttpsProxy ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

function clearCookie(res: any) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: behindHttpsProxy,
    sameSite: behindHttpsProxy ? "none" : "lax",
    path: "/",
  });
}

export function getUserIdFromRequest(req: any): number | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    return payload.userId;
  } catch {
    return null;
  }
}

function serializeUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    companyDescription: user.companyDescription,
    country: user.country,
    category: user.category,
    logoUrl: user.logoUrl,
    contactPhone: user.contactPhone,
    contactWebsite: user.contactWebsite,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password, role, companyName, country, category } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({ email, passwordHash, role, companyName, country, category })
    .returning();

  setCookie(res, user.id);
  res.status(201).json(serializeUser(user));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  setCookie(res, user.id);
  res.json(serializeUser(user));
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  clearCookie(res);
  res.json({ ok: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(serializeUser(user));
});

export { serializeUser };
export default router;
