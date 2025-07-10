import { z as z } from 'zod';

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  image: z.string().url(),
  creationAt: z.string(),
  updatedAt: z.string(),
});

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  price: z.number(),
  description: z.string(),
  category: CategorySchema,
  images: z.array(z.string().url()), // ✅ Changed from string to array of URLs
  creationAt: z.string(),
  updatedAt: z.string(),
});;

export type productSchema = z.infer<typeof ProductSchema>;
