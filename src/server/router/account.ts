import { z } from "zod";
import { t } from "./trpc";

export const accountRouter = t.router({
	getAll: t.procedure.query(async ({ctx}) => {
		return await ctx.prisma.account.findMany({include: {user: true}});
	}),
})
