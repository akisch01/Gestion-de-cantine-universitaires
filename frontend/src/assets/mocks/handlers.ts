// Handlers pour les données de test

import { rest } from "msw";
import type { RestRequest, ResponseComposition, RestContext } from "msw";
import { MOCK_USERS, MOCK_PLATS, MOCK_RESERVATIONS, MOCK_NOTIFICATIONS } from "./data";

// Handlers pour l'API
export const handlers = [
  // Authentification
  rest.post("/api/auth/login", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json({ token: "fake-token", user: MOCK_USERS[0] }));
  }),

  rest.post("/api/auth/register", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json({ token: "fake-token", user: MOCK_USERS[0] }));
  }),

  rest.get("/api/auth/me", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json(MOCK_USERS[0]));
  }),

  // Plats
  rest.get("/api/plats", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json(MOCK_PLATS));
  }),

  rest.get("/api/plats/:id", (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { id } = req.params;
    const plat = MOCK_PLATS.find((p) => p.id === Number(id));
    if (!plat) return res(ctx.status(404));
    return res(ctx.json(plat));
  }),

  // Réservations
  rest.get("/api/reservations", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json(MOCK_RESERVATIONS));
  }),

  rest.post("/api/reservations", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json(MOCK_RESERVATIONS[0]));
  }),

  // Notifications
  rest.get("/api/notifications", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json(MOCK_NOTIFICATIONS));
  }),

  rest.post("/api/notifications/:id/read", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json({ success: true }));
  }),

  // Admin
  rest.get("/api/admin/users", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.json(MOCK_USERS));
  }),

  rest.get("/api/admin/stats", (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(
      ctx.json({
        totalReservations: MOCK_RESERVATIONS.length,
        totalPlats: MOCK_PLATS.length,
        totalUsers: MOCK_USERS.length,
        revenue: MOCK_RESERVATIONS.reduce((acc, _res) => acc + 10, 0),
      })
    );
  }),
];