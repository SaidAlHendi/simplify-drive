import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.daily(
  'Delete files that were in trash for 30+ days',
  {
    hourUTC: 17,
    minuteUTC: 30,
  },
  internal.files.deleteForEver
)

export default crons
