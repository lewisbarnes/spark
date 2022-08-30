import { z, ZodError } from 'zod';
import { pusher } from '../../utils/pusher';
import { createRouter } from './context';
import superjson from 'superjson';

export const messageRouter = createRouter()
	.query('getLast20', {
		async resolve({ ctx }) {
			return await ctx.prisma.message.findMany({
				orderBy: { timestamp: 'desc' },
				include: { user: true },
			});
		},
	})
	.query('getByChannelId', {
		input: z.object({
			channelId: z.string(),
			num: z.number(),
		}),
		async resolve(req) {
			return await req.ctx.prisma.message.findMany({
				take: req.input.num,
				orderBy: { timestamp: 'desc' },
				include: { user: true },
				where: { channelId: req.input.channelId },
			});
		},
	})
	.mutation('add', {
		input: z.object({
			content: z.string().max(1000),
			channelId: z.string(),
		}),
		async resolve(req) {
				const message = await req.ctx.prisma.message.create({
					data: {
						content: req.input.content,
						userId: req.ctx.session!.user!.id!,
						channelId: req.input.channelId,
						timestamp: BigInt(Date.now()),
					},
					include: {user: true}
				});
	
				await pusher.trigger(req.input.channelId, 'new-message', {
					message: superjson.stringify(message),
					sender: req.ctx.session?.user?.id,
				});
				return message;
		},
	})
	.mutation('delete', {
		input: z.object({
			channelId: z.string(),
			messageId: z.string(),
		}),
		async resolve({ ctx, input }) {
			await ctx.prisma.message.delete({ where: { id: input.messageId } });
			await pusher.trigger(input.channelId, 'message-deleted', {
				message: { content: '', id: input.messageId },
				sender: ctx.session?.user,
			});
		},
	});
