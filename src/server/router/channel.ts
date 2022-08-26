import { createRouter } from './context';
import { z } from 'zod';
import { resolve } from 'path';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { trpc } from '../../utils/trpc';

export const channelRouter = createRouter()
	.query('getAll', {
		async resolve({ ctx }) {
			return await ctx.prisma.messageChannel.findMany({ include: { createdBy: true } });
		},
	})
	.query('getById', {
		input: z.object({
			channelId: z.string(),
		}),
		async resolve(req) {
			return await req.ctx.prisma.messageChannel.findFirst({
				include: { Messages: true },
				where: { id: req.input.channelId },
			});
		},
	})
	.mutation('create', {
		input: z.object({
			name: z.string().max(50),
		}),
		async resolve(req) {
			return await req.ctx.prisma.messageChannel.create({
				data: {
					name: req.input.name,
					userId: req.ctx.session?.user?.id!,
				}
			});
		},
	});
