import { Readable } from 'node:stream';

import { crc32 } from '@node-rs/crc32';
import { getStreamAsBuffer } from 'get-stream';

import { BlobInputType, PutObjectMetadata } from './provider';
import { getMime } from '../native';

export async function toBuffer(input: BlobInputType): Promise<Buffer> {
  return input instanceof Readable
    ? await getStreamAsBuffer(input)
    : input instanceof Buffer
      ? input
      : Buffer.from(input);
}

export async function autoMetadata(
  blob: Buffer,
  raw: PutObjectMetadata
): Promise<PutObjectMetadata> {
  const metadata = {
    ...raw,
  };
  try {
    // length
    if (!metadata.contentLength) {
      metadata.contentLength = blob.length;
    }

    // checksum
    if (!metadata.checksumCRC32) {
      metadata.checksumCRC32 = crc32(blob).toString(16);
    }

    // mime type
    if (!metadata.contentType) {
      try {
        metadata.contentType = getMime(blob);
      } catch {
        // ignore
      }
    }

    return metadata;
  } catch (e) {
    return metadata;
  }
}
