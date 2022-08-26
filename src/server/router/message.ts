import { createRouter } from './context';
import { z } from 'zod';
import { resolve } from 'path';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { trpc } from '../../utils/trpc';
import { Message } from '@prisma/client';
import { EventEmitter } from 'events';
import { pusher } from '../../utils/pusher';
import ogs from 'ts-open-graph-scraper';


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
			const id = await req.ctx.prisma.message.create({
				data: {
					content: req.input.content,
					userId: req.ctx.session!.user!.id!,
					channelId: req.input.channelId,
					timestamp: BigInt(Date.now()),
				},
				select: { id: true, content: true },
				
			});

			await pusher.trigger(req.input.channelId, "new-message", {
				message: {content: req.input.content!, id: id.id},
				sender: req.ctx.session?.user,
			});
		},
	})
	.mutation('delete', {
		input : z.object({
			channelId: z.string(),
			messageId: z.string(),
		}),
		async resolve({ctx, input}) {
			await ctx.prisma.message.delete({where:{id: input.messageId}});
			await pusher.trigger(input.channelId, "message-deleted", {
				message: {content: '', id: input.messageId},
				sender: ctx.session?.user,
			});
		}
	})
