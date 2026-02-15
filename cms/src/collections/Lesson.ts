// collections/Lesson.ts
import { CollectionConfig } from 'payload'
import type { User } from '../payload-types'

const isAdmin = (req: any) => {
  const user = req.user as User | null
  return user?.role?.toLowerCase() === 'admin'
}

export const Lesson: CollectionConfig = {
    slug: 'lessons',
    labels: {
      singular: 'Lesson',
      plural: 'Lessons',
    },
    access: {
      read: () => true,
      create: ({ req }) => isAdmin(req),
      update: ({ req }) => isAdmin(req),
      delete: ({ req }) => isAdmin(req),
    },
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'createdAt'],
    },

      fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the lesson',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A short description of the lesson',
      },
    },
    {
        name: 'heroImage',
        type: 'upload',
        relationTo: 'media-images',
        required: true,
        admin: {
          description: 'Upload the hero image for the lesson',
        },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media-videos', 
      required: true,
      admin: {
        description: 'Upload the video for the lesson',
      },
    },
  ],   
}