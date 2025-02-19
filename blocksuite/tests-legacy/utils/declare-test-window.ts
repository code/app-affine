import type { EditorHost } from '@blocksuite/block-std';
import type { AffineEditorContainer } from '@blocksuite/presets';
import type { Store, Transformer, Workspace } from '@blocksuite/store';

declare global {
  interface Window {
    /** Available on playground window
     * the following instance are initialized in `packages/playground/apps/starter/main.ts`
     */
    $blocksuite: {
      store: typeof import('@blocksuite/store');
      blocks: typeof import('@blocksuite/blocks');
      global: {
        utils: typeof import('@blocksuite/global/utils');
      };
      editor: typeof import('@blocksuite/presets');
      blockStd: typeof import('@blocksuite/block-std');
    };
    collection: Workspace;
    doc: Store;
    editor: AffineEditorContainer;
    host: EditorHost;
    job: Transformer;
  }
}
