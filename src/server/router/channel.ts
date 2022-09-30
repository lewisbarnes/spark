import { z } from 'zod';
import { t } from './trpc';

export const channelRouter = t.router({
  getAll: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.messageChannel.findMany({ include: { createdBy: true } });
  }),
  getById: t.procedure
    .input(
      z.object({
        channelId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.messageChannel.findFirst({
        where: { id: input.channelId },
      });
    }),
  create: t.procedure
    .input(
      z.object({
        name: z.string().max(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) {
        return null;
      }
      const session = ctx.session!;
      return await ctx.prisma.messageChannel.create({
        data: {
          name: input.name,
          userId: session.user!.id,
        },
      });
    }),
});

// export const channelRouter = createRouter()
// 	.query('getAll', {
// 		async resolve({ ctx }) {
// 			return await ctx.prisma.messageChannel.findMany({ include: { createdBy: true } });
// 		},
// 	})
// 	.query('getById', {
// 		input: z.object({
// 			channelId: z.string(),
// 		}),
// 		async resolve({ input, ctx }) {
// 			return await ctx.prisma.messageChannel.findFirst({
// 				where: { id: input.channelId },
// 			});
// 		},
// 	})
// 	.mutation('create', {
// 		input: z.object({
// 			name: z.string().max(50),
// 		}),
// 		async resolve(req) {
// 			return await req.ctx.prisma.messageChannel.create({
// 				data: {
// 					name: req.input.name,
// 					userId: req.ctx.session?.user?.id ? req.ctx.session?.user?.id : '',
// 				},
// 			});
// 		},
// 	});
