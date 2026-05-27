'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'fumadocs-core/framework';
import type { Folder } from 'fumadocs-core/page-tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';

function getItemOffset(depth: number) {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}

function isActiveRoot(item: Folder, pathname: string) {
  const url = item.index?.url;

  if (!url) {
    return false;
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

export function FilteredFolder({
  item,
  children,
}: {
  item: Folder;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const depth = useFolderDepth();
  const folderUrl = item.index?.url;
  const active = Boolean(folderUrl && (pathname === folderUrl || pathname.startsWith(`${folderUrl}/`)));
  const linkOffset = getItemOffset(Math.max(depth, 0));

  if (item.root) {
    if (!isActiveRoot(item, pathname)) {
      return null;
    }

    return <>{children}</>;
  }

  return (
    <SidebarFolder
      collapsible={item.collapsible}
      active={active}
      defaultOpen={item.defaultOpen ?? active}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          active={pathname === item.index.url}
          className="relative flex w-full flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground transition-colors wrap-anywhere hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary"
          style={{ paddingInlineStart: linkOffset }}
        >
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger
          className="relative flex w-full flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground transition-colors wrap-anywhere hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80"
          style={{ paddingInlineStart: linkOffset }}
        >
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent className="relative before:absolute before:inset-y-1 before:inset-s-2.5 before:w-px before:bg-fd-border before:content-['']">
        <div className="flex flex-col gap-0.5 pt-0.5">{children}</div>
      </SidebarFolderContent>
    </SidebarFolder>
  );
}
