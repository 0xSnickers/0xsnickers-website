import { pageSchema } from 'fumadocs-core/source/schema';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }),
  },
});

export default defineConfig();
