import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from '@blocksuite/affine-components/icons';
import { type EditorHost, TextSelection } from '@blocksuite/block-std';
import type { TemplateResult } from 'lit';

import {
  isTextStyleActive,
  toggleBold,
  toggleCode,
  toggleItalic,
  toggleLink,
  toggleStrike,
  toggleUnderline,
} from './text-style.js';

export interface TextFormatConfig {
  id: string;
  name: string;
  icon: TemplateResult<1>;
  hotkey?: string;
  activeWhen: (host: EditorHost) => boolean;
  action: (host: EditorHost) => void;
  textChecker?: (host: EditorHost) => boolean;
}

export const textFormatConfigs: TextFormatConfig[] = [
  {
    id: 'bold',
    name: 'Bold',
    icon: BoldIcon,
    hotkey: 'Mod-b',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextStyleActive, { key: 'bold' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleBold).run();
    },
  },
  {
    id: 'italic',
    name: 'Italic',
    icon: ItalicIcon,
    hotkey: 'Mod-i',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextStyleActive, { key: 'italic' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleItalic).run();
    },
  },
  {
    id: 'underline',
    name: 'Underline',
    icon: UnderlineIcon,
    hotkey: 'Mod-u',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextStyleActive, { key: 'underline' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleUnderline).run();
    },
  },
  {
    id: 'strike',
    name: 'Strikethrough',
    icon: StrikethroughIcon,
    hotkey: 'Mod-shift-s',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextStyleActive, { key: 'strike' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleStrike).run();
    },
  },
  {
    id: 'code',
    name: 'Code',
    icon: CodeIcon,
    hotkey: 'Mod-e',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextStyleActive, { key: 'code' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleCode).run();
    },
  },
  {
    id: 'link',
    name: 'Link',
    icon: LinkIcon,
    hotkey: 'Mod-k',
    activeWhen: host => {
      const [result] = host.std.command
        .chain()
        .pipe(isTextStyleActive, { key: 'link' })
        .run();
      return result;
    },
    action: host => {
      host.std.command.chain().pipe(toggleLink).run();
    },
    // should check text length
    textChecker: host => {
      const textSelection = host.std.selection.find(TextSelection);
      if (!textSelection || textSelection.isCollapsed()) return false;

      return Boolean(
        textSelection.from.length + (textSelection.to?.length ?? 0)
      );
    },
  },
];
