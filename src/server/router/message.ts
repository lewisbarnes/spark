import { z, ZodError } from 'zod';
import { pusherServer } from '../../utils/pusherServer';
import superjson from 'superjson';
import { t } from './trpc';
import MessageParser from '../../utils/messageParser';

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
  send: t.procedure
    .input(
      z.object({
        content: z.string().max(2000),
        channelId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.prisma.message.create({
        data: {
          content: superjson.stringify(MessageParser(input.content)),
          userId: ctx.session!.user!.id!,
          channelId: input.channelId,
          timestamp: BigInt(Date.now()),
        },
        include: { user: true },
      });
      await pusherServer.trigger(input.channelId, 'new-message', {
        message: superjson.stringify(message),
        sender: 'server',
      });
      return message;
    }),
  delete: t.procedure
    .input(
      z.object({
        channelId: z.string(),
        messageId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.message.delete({ where: { id: input.messageId } });
      await pusherServer.trigger(input.channelId, 'message-deleted', {
        message: { content: '' },
        sender: 'server',
      });
    }),
});
