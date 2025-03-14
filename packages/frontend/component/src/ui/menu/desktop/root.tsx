import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import React from 'react';

import type { MenuProps } from '../menu.types';
import * as styles from '../styles.css';
import { useMenuContentController } from './controller';
import * as desktopStyles from './styles.css';

export const DesktopMenu = ({
  children,
  items,
  noPortal,
  portalOptions,
  rootOptions: {
    onOpenChange,
    defaultOpen,
    modal,
    open: rootOpen,
    ...rootOptions
  } = {},
  contentOptions: {
    className = '',
    style: contentStyle = {},
    side,
    sideOffset,
    ...otherContentOptions
  } = {},
}: MenuProps) => {
  const { handleOpenChange, contentSide, contentOffset, contentRef, open } =
    useMenuContentController({
      open: rootOpen,
      defaultOpen,
      onOpenChange,
      side,
      sideOffset: (sideOffset ?? 0) + 5,
    });
  const ContentWrapper = noPortal ? React.Fragment : DropdownMenu.Portal;
  return (
    <DropdownMenu.Root
      onOpenChange={handleOpenChange}
      defaultOpen={defaultOpen}
      modal={modal ?? false}
      open={open}
      {...rootOptions}
    >
      <DropdownMenu.Trigger
        asChild
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {children}
      </DropdownMenu.Trigger>

      <ContentWrapper {...portalOptions}>
        <DropdownMenu.Content
          className={clsx(
            styles.menuContent,
            desktopStyles.contentAnimation,
            className
          )}
          align="start"
          ref={contentRef}
          side={contentSide}
          style={{ zIndex: 'var(--affine-z-index-popover)', ...contentStyle }}
          avoidCollisions={false}
          sideOffset={contentOffset}
          {...otherContentOptions}
        >
          {items}
        </DropdownMenu.Content>
      </ContentWrapper>
    </DropdownMenu.Root>
  );
};
