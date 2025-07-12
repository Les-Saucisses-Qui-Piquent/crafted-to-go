import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { vi } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";

// Helper function to mock fastify request object
export const mockRequest = <T extends RouteGenericInterface>(
  overrides: Partial<FastifyRequest<T>> = {},
): FastifyRequest<T> => {
  const base: unknown = {
    server: { prisma: mockedPrisma, log: { error: vi.fn() } },
    ...overrides,
  };
  return base as FastifyRequest<T>;
};

// Mocking fastify reply object
const send = vi.fn();
const status = vi.fn(() => ({ send }));
export const mockedReply = { status, send } as unknown as FastifyReply;
