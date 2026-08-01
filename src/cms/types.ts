import type { D1Database, R2Bucket, KVNamespace, VectorizeIndex } from '@cloudflare/workers-types'

export interface Bindings {
  // Database & Storage
  DB: D1Database;
  MY_BUCKET: R2Bucket;
  QURAN_CACHE: KVNamespace;

  // AI & Vector Search
  AI: any;
  VECTORIZE_INDEX: VectorizeIndex; // Untuk Tarjih CMS
  VECTOR_INDEX?: VectorizeIndex;   // Untuk Quran (Opsional)
}

export type Content = {
  id: number;
  slug: string;
  title: string;
  body: string;
  type: string;
  status: string;
  attributes?: string;
}