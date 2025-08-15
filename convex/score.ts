import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";

export const addScore = mutation({
  args: {
    answered: v.number(),
    name: v.string(),
    score: v.number(),
    gender: v.string(),
  },
  handler: async (ctx, args) => {
    const newScoreId = await ctx.db.insert("scores", {
      answered: args.answered,
      name: args.name,
      score: args.score,
      gender: args.gender,
    });
    return newScoreId;
  },
});

export const scores = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("scores").collect()).reverse();
  },
});
