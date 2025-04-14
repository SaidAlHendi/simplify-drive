import { ConvexError, v } from 'convex/values'
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server'
import { getUser } from './users'

async function hatAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) {
  const user = await getUser(ctx, tokenIdentifier)
  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)
  return hasAccess
}
export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) {
      throw new Error('you muss logged in')
    }
    const hasAccess = await hatAccessToOrg(
      ctx,
      idenity.tokenIdentifier,
      args.orgId
    )
    if (!hasAccess) {
      throw new ConvexError('You dont have access.!')
    }
    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
    })
  },
})

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) {
      return []
    }
    const hasAccess = await hatAccessToOrg(
      ctx,
      idenity.tokenIdentifier,
      args.orgId
    )
    if (!hasAccess) {
      return []
    }
    return ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect()
  },
})
