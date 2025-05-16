// Configuration des tests

import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";

// Configuration du serveur MSW pour les tests
export const server = setupServer(...handlers);

// Configuration globale pour les tests
beforeAll(() => {
  // Démarrer le serveur MSW
  server.listen();
});

afterEach(() => {
  // Réinitialiser les handlers après chaque test
  server.resetHandlers();
});

afterAll(() => {
  // Arrêter le serveur MSW
  server.close();
});

// Configuration de l'environnement de test
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Configuration des mocks globaux
jest.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock("../hooks/useReservation", () => ({
  useReservation: () => ({
    reservations: [],
    fetchReservations: jest.fn(),
    createReservation: jest.fn(),
    cancelReservation: jest.fn(),
  }),
}));

jest.mock("../hooks/useWebSocket", () => ({
  useWebSocket: (_callback: (message: any) => void) => ({
    sendMessage: jest.fn(),
  }),
}));