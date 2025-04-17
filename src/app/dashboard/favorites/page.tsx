'use client'
import React from 'react'
import FilesBrowser from '../_components/filesBrowser'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <FilesBrowser title={'Favoritrs'} favorites={true} />
    </div>
  )
}

export default page
