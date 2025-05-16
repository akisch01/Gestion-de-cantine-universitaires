// Utilitaires pour les tests

import { render, RenderResult } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../providers/ThemeProvider";
import { WebSocketProvider } from "../../providers/WebSocketProvider";
import { AuthProvider } from "../../features/auth/AuthProvider";
import { ReactElement } from 'react';
import React from 'react';

// Fonction pour rendre un composant avec les providers
export function renderWithProviders(ui: ReactElement): RenderResult {
  return render(
    React.createElement(BrowserRouter, null,
      React.createElement(ThemeProvider, null,
        React.createElement(WebSocketProvider, null,
          React.createElement(AuthProvider, null, ui)
        )
      )
    )
  );
}

// Types pour les mocks
interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

interface Reservation {
  id: string;
  date: string;
  [key: string]: unknown;
}

interface Notification {
  id: string;
  message: string;
  [key: string]: unknown;
}

// Fonction pour simuler un utilisateur connecté
export function mockUser(user: User): void {
  jest.spyOn(require("../hooks/useAuth"), "useAuth").mockReturnValue({
    user,
    login: jest.fn(),
    logout: jest.fn(),
  });
}

// Fonction pour simuler des réservations
export function mockReservations(reservations: Reservation[]): void {
  jest.spyOn(require("../hooks/useReservation"), "useReservation").mockReturnValue({
    reservations,
    fetchReservations: jest.fn(),
    createReservation: jest.fn(),
    cancelReservation: jest.fn(),
  });
}

// Fonction pour simuler des notifications
export function mockNotifications(notifications: Notification[]): void {
  jest.spyOn(require("../hooks/useWebSocket"), "useWebSocket").mockReturnValue({
    notifications,
    sendMessage: jest.fn(),
  });
}

// Fonction pour simuler un délai
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fonction pour simuler un événement
export function fireEvent(element: HTMLElement, eventName: string): void {
  const event = new Event(eventName, { bubbles: true });
  element.dispatchEvent(event);
}

// Fonction pour simuler un changement d'input
export function changeInput(element: HTMLInputElement, value: string): void {
  element.value = value;
  fireEvent(element, "input");
}

// Fonction pour simuler un clic
export function click(element: HTMLElement): void {
  fireEvent(element, "click");
}

// Fonction pour simuler une soumission de formulaire
export function submitForm(element: HTMLFormElement): void {
  fireEvent(element, "submit");
}

// Fonction pour simuler une navigation
export function navigate(path: string): void {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
}

// Fonction pour simuler une réponse d'API
export function mockApiResponse<T>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data });
}

// Fonction pour simuler une erreur d'API
export function mockApiError(error: Error): Promise<never> {
  return Promise.reject(error);
}

export const mockMatchMedia = (): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};