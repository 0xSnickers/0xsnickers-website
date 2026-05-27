import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { GetLayoutTabsOptions } from 'fumadocs-ui/layouts/shared';
import { FilteredFolder } from '@/components/docs/SidebarTree';
import { DocsNavTitle, DocsThemeTools } from '@/components/docs/Tools';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

const tabs: GetLayoutTabsOptions = {
  transform(option) {
    return {
      ...option,
      icon: null,
    };
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <DocsLayout
        {...baseOptions()}
        tree={source.getPageTree()}
        tabMode="auto"
        tabs={tabs}
        sidebar={{
          collapsible: true,
          defaultOpenLevel: 1,
          components: {
            Folder: FilteredFolder,
          },
        }}
        slots={{
          navTitle: DocsNavTitle,
          themeSwitch: DocsThemeTools,
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
