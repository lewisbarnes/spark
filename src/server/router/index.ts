// src/server/router/index.ts
import { t } from "./trpc";
import { accountRouter } from './account';
import { channelRouter } from './channel';
import { messageRouter } from './message';


// const legacyRouter = createRouter()
// 	.transformer(superjson)
// 	.merge('account.', accountRouter)
// 	.merge('message.', messageRouter)
// 	.merge('channel.', channelRouter)
// 	.merge('openGraph.',openGraphRouter).interop()


export const appRouter = t.router({
	account: accountRouter,
	message: messageRouter,
	channel: channelRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter;
