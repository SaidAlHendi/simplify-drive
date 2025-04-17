'use client'

import FilesBrowser from '../_components/filesBrowser'

export default function FavoritesPage() {
  return (
    <div>
      <FilesBrowser title='Trash' deletedOnly />
    </div>
  )
}
