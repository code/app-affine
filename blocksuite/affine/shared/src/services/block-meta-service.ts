import type { BlockMeta } from '@blocksuite/affine-model';
import { type BlockModel, StoreExtension } from '@blocksuite/store';

import { FeatureFlagService } from './feature-flag-service';
import { WriterInfoProvider } from './user-service';

/**
 * The service is used to add following info to the block.
 * - createdAt: The time when the block is created.
 * - createdBy: The user who created the block.
 * - updatedAt: The time when the block is updated.
 * - updatedBy: The user who updated the block.
 */
export class BlockMetaService extends StoreExtension {
  static override key = 'affine-block-meta-service';

  get isBlockMetaEnabled() {
    const flagService = this.store.get(FeatureFlagService);
    return flagService.getFlag('enable_block_meta') === true;
  }

  override loaded() {
    this.store.disposableGroup.add(
      this.store.slots.blockUpdated.subscribe(({ type, id }) => {
        if (!this.isBlockMetaEnabled) return;

        const model = this.store.getBlock(id)?.model;
        if (!model) return;

        if (type === 'add') {
          return this._onBlockCreated(model);
        }

        if (type === 'update') {
          return this._onBlockUpdated(model);
        }
      })
    );
  }

  private readonly _onBlockCreated = (model: BlockModel<BlockMeta>): void => {
    if (!isBlockMetaSupported(model)) {
      return;
    }

    const writer = this._getWriterInfo();
    if (!writer) return;
    const now = getNow();

    this.store.withoutTransact(() => {
      const isFlatModel = model.schema.model.isFlatData;
      if (!isFlatModel) {
        model['meta:createdAt'] = now;
        model['meta:createdBy'] = writer.id;
        return;
      }

      model.props['meta:createdAt'] = now;
      model.props['meta:createdBy'] = writer.id;
    });
  };

  private readonly _onBlockUpdated = (model: BlockModel<BlockMeta>): void => {
    if (!isBlockMetaSupported(model)) {
      return;
    }

    const writer = this._getWriterInfo();
    if (!writer) return;
    const now = getNow();

    this.store.withoutTransact(() => {
      const isFlatModel = model.schema.model.isFlatData;
      if (!isFlatModel) {
        model['meta:updatedAt'] = now;
        model['meta:updatedBy'] = writer.id;
        if (!model['meta:createdAt']) {
          model['meta:createdAt'] = now;
          model['meta:createdBy'] = writer.id;
        }
        return;
      }

      model.props['meta:updatedAt'] = now;
      model.props['meta:updatedBy'] = writer.id;
      if (!model.props['meta:createdAt']) {
        model.props['meta:createdAt'] = now;
        model.props['meta:createdBy'] = writer.id;
      }
    });
  };

  private readonly _getWriterInfo = () => {
    return this.store.getOptional(WriterInfoProvider)?.getWriterInfo();
  };
}

function isBlockMetaSupported(model: BlockModel) {
  return [
    'meta:createdAt',
    'meta:createdBy',
    'meta:updatedAt',
    'meta:updatedBy',
  ].every(key => model.keys.includes(key));
}

function getNow() {
  return Date.now();
}
