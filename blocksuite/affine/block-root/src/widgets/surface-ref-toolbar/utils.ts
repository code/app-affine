import type { CanvasRenderer } from '@blocksuite/affine-block-surface';
import { ExportManager } from '@blocksuite/affine-block-surface';
import type { SurfaceRefBlockComponent } from '@blocksuite/affine-block-surface-ref';
import { isTopLevelBlock } from '@blocksuite/affine-shared/utils';
import type { EditorHost } from '@blocksuite/block-std';
import {
  GfxControllerIdentifier,
  type GfxModel,
} from '@blocksuite/block-std/gfx';
import { Bound } from '@blocksuite/global/gfx';
import { assertExists } from '@blocksuite/global/utils';

export const edgelessToBlob = async (
  host: EditorHost,
  options: {
    surfaceRefBlock: SurfaceRefBlockComponent;
    surfaceRenderer: CanvasRenderer;
    edgelessElement: GfxModel;
  }
): Promise<Blob> => {
  const { edgelessElement } = options;
  const exportManager = host.std.get(ExportManager);
  const bound = Bound.deserialize(edgelessElement.xywh);
  const isBlock = isTopLevelBlock(edgelessElement);
  const gfx = host.std.get(GfxControllerIdentifier);

  return exportManager
    .edgelessToCanvas(
      options.surfaceRenderer,
      bound,
      gfx,
      isBlock ? [edgelessElement] : undefined,
      isBlock ? undefined : [edgelessElement],
      { zoom: options.surfaceRenderer.viewport.zoom }
    )
    .then(canvas => {
      assertExists(canvas);
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          blob => (blob ? resolve(blob) : reject(null)),
          'image/png'
        );
      });
    });
};

export const writeImageBlobToClipboard = async (blob: Blob) => {
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
};
