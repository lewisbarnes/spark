// src/server/router/index.ts
import { createRouter } from '../router/context';
import superjson from 'superjson';

import { accountRouter } from './account';
import { protectedExampleRouter } from './protected-example-router';
import { messageRouter } from './message';
import { channelRouter } from './channel';
import { openGraphRouter } from './opengraph';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('account.', accountRouter)
	.merge('message.', messageRouter)
	.merge('channel.', channelRouter)
	.merge('openGraph.',openGraphRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
