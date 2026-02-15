import type { CollectionConfig } from 'payload'
import type { User } from '../payload-types'

const isAdmin = (req: any) => {
  const user = req.user as User | null
  return user?.role?.toLowerCase() === 'admin'
}

export const MediaImages: CollectionConfig = {
  slug: 'media-images',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
    create: ({ req }) => isAdmin(req),
    update: ({ req }) => isAdmin(req),
    delete: ({ req }) => isAdmin(req),
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
