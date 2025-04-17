import React from 'react'
import FilesBrowser from '../_components/filesBrowser'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <FilesBrowser title={'Your Files'} />
    </div>
  )
}

export default page
