import { ConvexError, v } from 'convex/values'
import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from './_generated/server'
import { roles } from './schema'

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', tokenIdentifier)
    )
    .first()
  if (!user) throw new ConvexError('user should to be defined')

  return user
}
export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert('users', {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      image: args.image,
      orgIds: [],
    })
  },
})
export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('users')
      .withIndex('by_tokenIdentifier', (q) =>
        q.eq('tokenIdentifier', args.tokenIdentifier)
      )
      .first()
    if (!user) throw new ConvexError('no Use Finde')
    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
    })
  },
})
export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier)

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
    })
  },
})

export const updateRoleInOrgForUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier)

    const org = user.orgIds.find((org) => org.orgId === args.orgId)
    if (!org) {
      throw new ConvexError(
        'expected an  org on the user but was not found when updating '
      )
    }
    org.role = args.role
    console.log(org.role)
    console.log(user.orgIds)

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds,
    })
  },
})

export const getUserProfile = query({
  args: { userId: v.id('users') },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId)
    if (user)
      return {
        name: user.name,
        image: user.image,
      }
  },
})

export const getMe = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      return null
    }

    const user = await getUser(ctx, identity.tokenIdentifier)

    if (!user) {
      return null
    }

    return user
  },
})
