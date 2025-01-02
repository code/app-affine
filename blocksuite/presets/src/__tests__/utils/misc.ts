import { replaceIdMiddleware } from '@blocksuite/blocks';
import { type DocCollection, type DocSnapshot, Job } from '@blocksuite/store';

export async function importFromSnapshot(
  collection: DocCollection,
  snapshot: DocSnapshot
) {
  const job = new Job({
    schema: collection.schema,
    blobCRUD: collection.blobSync,
    docCRUD: {
      create: (id: string) => collection.createDoc({ id }),
      get: (id: string) => collection.getDoc(id),
      delete: (id: string) => collection.removeDoc(id),
    },
    middlewares: [replaceIdMiddleware(collection.idGenerator)],
  });

  return job.snapshotToDoc(snapshot);
}
