'use client'

import FilesBrowser from '../_components/filesBrowser'

export default function FavoritesPage() {
  return (
    <div>
      <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
        <p className='text-sm text-red-700'>
          Files in trash will be permanently deleted after 30 days.
        </p>
      </div>
      <FilesBrowser title='Trash' deletedOnly />
    </div>
  )
}
