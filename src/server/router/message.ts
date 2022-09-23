import { z, ZodError } from 'zod';
import { pusherServer } from '../../utils/pusherServer';
import superjson from 'superjson';
import { t } from './trpc';

export const messageRouter = t.router({
  getAllByChannelId: t.procedure
    .input(
      z.object({
        channelId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
			return await ctx.prisma.message.findMany({
        include: { user: true },
        orderBy: { timestamp: 'desc' },
        where: { channelId: input.channelId },
      });
		}),
	add: t.procedure.input(z.object({
		content: z.string().max(1000),
		channelId: z.string(),
	})).mutation( async ({ input, ctx }) => {
		const message = await ctx.prisma.message.create({
			data: {
				content: input.content,
				userId: ctx.session!.user!.id!,
				channelId: input.channelId,
				timestamp: BigInt(Date.now()),
			},
			include: { user: true },
		});
		await pusherServer.trigger(input.channelId, 'new-message', {
			message: superjson.stringify(message),
			sender: ctx.session?.user?.id,
		});
		return message;
	}),
	delete: t.procedure.input(z.object({
		channelId: z.string(),
		messageId: z.string(),
	})).mutation(async ({ input, ctx}) => {
		await ctx.prisma.message.delete({ where: { id: input.messageId } });
		await pusherServer.trigger(input.channelId, 'message-deleted', {
			message: { content: '', id: input.messageId },
			sender: ctx.session?.user,
		});
	})
});

// export const messageRouter = createRouter()
//   .query('getLast20', {
//     async resolve({ ctx }) {
//       return await ctx.prisma.message.findMany({
//         orderBy: { timestamp: 'desc' },
//         include: { user: true },
//       });
//     },
//   })
//   .query('getAllByChannelId', {
//     input: z.object({
//       channelId: z.string(),
//     }),
//     async resolve(req) {
//       return await req.ctx.prisma.message.findMany({
//         include: { user: true },
//         orderBy: { timestamp: 'desc' },
//         where: { channelId: req.input.channelId },
//       });
//     },
//   })
//   .mutation('add', {
//     input: z.object({
//       content: z.string().max(1000),
//       channelId: z.string(),
//     }),
//     async resolve(req) {
//       const message = await req.ctx.prisma.message.create({
//         data: {
//           content: req.input.content,
//           userId: req.ctx.session!.user!.id!,
//           channelId: req.input.channelId,
//           timestamp: BigInt(Date.now()),
//         },
//         include: { user: true },
//       });

//       await pusherServer.trigger(req.input.channelId, 'new-message', {
//         message: superjson.stringify(message),
//         sender: req.ctx.session?.user?.id,
//       });
//       return message;
//     },
//   })
//   .mutation('delete', {
//     input: z.object({
//       channelId: z.string(),
//       messageId: z.string(),
//     }),
//     async resolve({ ctx, input }) {
//       await ctx.prisma.message.delete({ where: { id: input.messageId } });
//       await pusherServer.trigger(input.channelId, 'message-deleted', {
//         message: { content: '', id: input.messageId },
//         sender: ctx.session?.user,
//       });
//     },
//   });
