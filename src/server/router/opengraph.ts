import { createRouter } from './context';
import { z } from 'zod';
import ogs from 'ts-open-graph-scraper';

export const openGraphRouter = createRouter()
	.query('scrape', {
		input: z.object({
			url: z.string(),
		}),
		async resolve({ ctx, input }) {
			const ogData = await ogs({url: input.url});
			return { url:input.url, title: ogData.ogTitle, siteName: ogData.ogSiteName, image: ogData.ogImage, desc: ogData.ogDescription};
	}});
