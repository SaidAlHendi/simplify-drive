import { ConvexError, v } from 'convex/values'
import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from './_generated/server'
import { getUser } from './users'
import { fileTypes, roles } from './schema'
import { Doc, Id } from './_generated/dataModel'
import { access } from 'fs'

export const generateUploadUrl = mutation(async (ctx) => {
  const idenity = await ctx.auth.getUserIdentity()
  if (!idenity) {
    throw new Error('you muss be logged in to upload file')
  }
  return await ctx.storage.generateUploadUrl()
})
async function hatAccessToOrg(ctx: QueryCtx | MutationCtx, orgId: string) {
  const idenity = await ctx.auth.getUserIdentity()
  if (!idenity) {
    return null
  }
  const user = await getUser(ctx, idenity.tokenIdentifier)
  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId)
  if (!hasAccess) {
    return null
  }
  return { user }
}
export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    fileId: v.id('_storage'),
    type: fileTypes,
  },
  async handler(ctx, args) {
    const hasAccess = await hatAccessToOrg(ctx, args.orgId)
    if (!hasAccess) {
      throw new ConvexError('You dont have access.!')
    }
    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      shouldDelete: false,
      userId: hasAccess.user._id,
    })
  },
})

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    const hasAccess = await hatAccessToOrg(ctx, args.orgId)
    if (!hasAccess) {
      return []
    }

    let query = args.query
    let files
    if (query) {
      files = await ctx.db
        .query('files')
        .withSearchIndex('search_body', (q) =>
          q
            .search('name', query)
            .eq('orgId', args.orgId)
            .eq('shouldDelete', args.deletedOnly || false)
        )
        .collect()
    } else {
      files = await ctx.db
        .query('files')
        .withIndex('by_orgId', (q) =>
          q
            .eq('orgId', args.orgId)
            .eq('shouldDelete', args.deletedOnly || false)
        )
        .collect()
    }
    if (args.favorites) {
      const favorites = await ctx.db
        .query('favorites')
        .withIndex('by_userId_orgId_fileId', (q) =>
          q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId)
        )
        .collect()
      files = files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
      )
    }
    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete)
    }
    if (args.type) {
      files = files.filter((file) => file.type === args.type)
    }
    return files
  },
})

export const getImageUrl = query({
  args: { imageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId)
  },
})
function assertCanDeleteFile(user: Doc<'users'>, file: Doc<'files'>) {
  const canDelete =
    file.userId === user._id ||
    user.orgIds.find((org) => org.orgId === file.orgId)?.role === 'admin'

  if (!canDelete) {
    throw new ConvexError('you have no acces to delete this file')
  }
}

export const deleteFile = mutation({
  args: { fileId: v.id('files') },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId)

    if (!access) {
      throw new ConvexError('no access to file')
    }

    assertCanDeleteFile(access.user, access.file)

    await ctx.db.patch(args.fileId, {
      shouldDelete: true,
      deletedAt: Date.now(),
    })
  },
})

export const restoreFile = mutation({
  args: { fileId: v.id('files') },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId)

    if (!access) {
      throw new ConvexError('no access to file')
    }

    assertCanDeleteFile(access.user, access.file)

    await ctx.db.patch(args.fileId, {
      shouldDelete: false,
      deletedAt: undefined,
    })
  },
})
export const toggleFavorite = mutation({
  args: { fileId: v.id('files') },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId)

    if (!access) {
      throw new ConvexError('no access to file')
    }
    const favorite = await ctx.db
      .query('favorites')
      .withIndex('by_userId_orgId_fileId', (q) =>
        q
          .eq('userId', access.user._id)
          .eq('orgId', access.file.orgId)
          .eq('fileId', access.file._id)
      )
      .first()

    if (!favorite) {
      await ctx.db.insert('favorites', {
        fileId: access.file._id,
        orgId: access.file.orgId,
        userId: access.user._id,
      })
    } else {
      await ctx.db.delete(favorite._id)
    }
  },
})

async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<'files'>
) {
  const file = await ctx.db.get(fileId)
  if (!file) return null
  const hasAccess = await hatAccessToOrg(ctx, file.orgId)
  if (!hasAccess) {
    return null
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', hasAccess.user.tokenIdentifier)
    )
    .first()

  if (!user) {
    return null
  }
  return {
    user,
    file,
  }
}

export const getAllFavorites = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hatAccessToOrg(ctx, args.orgId)
    if (!hasAccess) {
      return []
    }
    const favorites = await ctx.db
      .query('favorites')
      .withIndex('by_userId_orgId_fileId', (q) =>
        q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId)
      )
      .collect()
    return favorites
  },
})

export const deleteForEver = internalMutation({
  args: {},
  async handler(ctx) {
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
    const now = Date.now()
    let files = await ctx.db
      .query('files')
      .withIndex('by_shouldDelete', (q) => q.eq('shouldDelete', true))
      .collect()
    const oldFiles = files.filter(
      (file) => file.deletedAt && now - file.deletedAt > THIRTY_DAYS
    )
    await Promise.all(
      oldFiles.map(async (file) => {
        await ctx.storage.delete(file.fileId)
        return await ctx.db.delete(file._id)
      })
    )
  },
})
