import { createRouter } from "./context";
import { z } from "zod";

export const accountRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.account.findMany({include: {user: true}});
    },
  });
