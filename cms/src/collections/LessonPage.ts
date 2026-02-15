// collections/Lesson.ts
import { CollectionConfig } from 'payload'
import type { User } from '../payload-types'

const isAdmin = (req: any) => {
  const user = req.user as User | null
  return user?.role?.toLowerCase() === 'admin'
}

export const LessonPage: CollectionConfig = {
    slug: 'lesson-pages',
    labels: {
      singular: 'Lesson Page',
      plural: 'Lesson Pages',
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
        description: 'Title of the lesson page',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug for the page',
      },
    },
    {
        name: 'order',
        type: 'number',
        required: true,
        admin: {
            description: 'Order of the lesson page in the sequence',
        },
        defaultValue: 0,
    },
    {
      name: 'lessons',
        type: 'relationship',
        relationTo: 'lessons',
        hasMany: true,
        admin: {
            description: 'Select the lessons to include in this lesson page',
        },
    },
  ],
}