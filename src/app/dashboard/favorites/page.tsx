'use client'
import React from 'react'
import FilesBrowser from '../_components/filesBrowser'

const page = () => {
  return (
    <div>
      <FilesBrowser title={'Favoritrs'} favorites={true} />
    </div>
  )
}

export default page
