import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
export const createFile = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) {
      throw new Error('you muss logged in')
    }
    await ctx.db.insert('files', {
      name: args.name,
    })
  },
})

export const getFiles = query({
  args: {},
  async handler(ctx, args) {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) {
      return []
    }
    return ctx.db.query('files').collect()
  },
})
