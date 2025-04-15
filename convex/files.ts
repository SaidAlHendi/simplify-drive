import { ConvexError, v } from 'convex/values'
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server'
import { getUser } from './users'
import { fileTypes } from './schema'

export const generateUploadUrl = mutation(async (ctx) => {
  const idenity = await ctx.auth.getUserIdentity()
  if (!idenity) {
    throw new Error('you muss be logged in to upload file')
  }
  return await ctx.storage.generateUploadUrl()
})
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
    fileId: v.id('_storage'),
    type: fileTypes,
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
      fileId: args.fileId,
      type: args.type,
    })
  },
})

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
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
    const query = args.query
    if (query) {
      return ctx.db
        .query('files')
        .withSearchIndex('search_body', (q) =>
          q.search('name', query).eq('orgId', args.orgId)
        )
        .collect()
    } else {
      return ctx.db
        .query('files')
        .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
        .collect()
    }
  },
})

export const deleteFile = mutation({
  args: { fileId: v.id('files') },
  async handler(ctx, args) {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) {
      throw new Error('you muss be logged in to upload file')
    }
    const file = await ctx.db.get(args.fileId)
    if (!file) throw new ConvexError('file dose not exeist')
    const hasAccess = await hatAccessToOrg(
      ctx,
      idenity.tokenIdentifier,
      file.orgId
    )
    if (!hasAccess) {
      throw new ConvexError('You dont have access to delete this file!')
    }
    await ctx.db.delete(args.fileId)
  },
})

export const getImageUrl = query({
  args: { imageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId)
  },
})
