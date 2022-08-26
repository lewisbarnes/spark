import { createRouter } from './context';
import { z } from 'zod';
import { resolve } from 'path';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { trpc } from '../../utils/trpc';
import { Message } from '@prisma/client';
import { EventEmitter } from 'events';
import { pusher } from '../../utils/pusher';
import ogs from 'ts-open-graph-scraper';

export const openGraphRouter = createRouter()
	.query('scrape', {
		input: z.object({
			url: z.string(),
		}),
		async resolve({ ctx, input }) {
			const ogData = await ogs({url: input.url});
			return { title: ogData.ogTitle, siteName: ogData.ogSiteName, image: ogData.ogImage, desc: ogData.ogDescription};
	}});
