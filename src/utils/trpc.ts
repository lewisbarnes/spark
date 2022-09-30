// src/utils/trpc.ts
import type { AppRouter } from "../server/router";
import { createReactQueryHooks } from "@trpc/react";
import { inferProcedureOutput, inferProcedureInput, initTRPC } from "@trpc/server";
import { Context } from "../server/router/context";
import superjson from 'superjson';
import { createTRPCNext } from "@trpc/next";

import { httpBatchLink, loggerLink } from '@trpc/client';

function getBaseUrl() {
  // browser should use relative url
  if (typeof window !== 'undefined') return '';

  // reference for vercel.com SSR
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // reference for render.com SSR
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // override for docker etc SSR
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  // assume localhost in dev SSR
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export const trpc = createTRPCNext<AppRouter>({
	config() {
		return {
			transformer: superjson,
			links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
		}
	},
	ssr: false,
});

export type RouterOutput = inferProcedureOutput<AppRouter>;

export const withTRPC = trpc.withTRPC;
// export type MessageOutput = inferProcedureOutput<AppRouter>;
// export type AccountOutput = inferProcedureOutput<AppRouter['account']>;
