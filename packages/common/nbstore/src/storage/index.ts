import EventEmitter2 from 'eventemitter2';

import type { AwarenessStorage } from './awareness';
import type { BlobStorage } from './blob';
import type { DocStorage } from './doc';
import type { DocSyncStorage } from './doc-sync';
import { DummyAwarenessStorage } from './dummy/awareness';
import { DummyBlobStorage } from './dummy/blob';
import { DummyDocStorage } from './dummy/doc';
import { DummyDocSyncStorage } from './dummy/doc-sync';
import type { StorageType } from './storage';

type Storages = DocStorage | BlobStorage | DocSyncStorage | AwarenessStorage;

export type SpaceStorageOptions = {
  [K in StorageType]?: Storages & { storageType: K };
};

export class SpaceStorage {
  protected readonly storages: {
    [K in StorageType]: Storages & { storageType: K };
  };
  private readonly event = new EventEmitter2();
  private readonly disposables: Set<() => void> = new Set();

  constructor(storages: SpaceStorageOptions) {
    this.storages = {
      awareness: storages.awareness ?? new DummyAwarenessStorage(),
      blob: storages.blob ?? new DummyBlobStorage(),
      doc: storages.doc ?? new DummyDocStorage(),
      ['docSync']: storages['docSync'] ?? new DummyDocSyncStorage(),
    };
  }

  get<T extends StorageType>(type: T): Extract<Storages, { storageType: T }> {
    const storage = this.storages[type];

    if (!storage) {
      throw new Error(`Storage ${type} not registered.`);
    }

    return storage as unknown as Extract<Storages, { storageType: T }>;
  }

  connect() {
    Object.values(this.storages).forEach(storage => {
      storage.connection.connect();
    });
  }

  disconnect() {
    Object.values(this.storages).forEach(storage => {
      storage.connection.disconnect();
    });
  }

  async waitForConnected(signal?: AbortSignal) {
    await Promise.all(
      Object.values(this.storages).map(storage =>
        storage.connection.waitForConnected(signal)
      )
    );
  }

  async destroy() {
    this.disposables.forEach(disposable => disposable());
    this.event.removeAllListeners();
  }
}

export * from './awareness';
export * from './blob';
export * from './doc';
export * from './doc-sync';
export * from './errors';
export * from './history';
export * from './storage';
