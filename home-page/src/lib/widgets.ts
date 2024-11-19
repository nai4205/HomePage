import { Header } from '@/components/Header';

export type Item = {
  name: string;
  slug: string;
  description?: string;
  component?: React.FC<{ item: Item }>; 
}

export const widgets: { name: string; items: Item[] }[] = [
  {
    name: 'Text',
    items: [
      {
        name: 'Header',
        slug: 'layouts',
        description: 'Heading widget',
        component: Header,
      },
      {
        name: 'Grouped Layouts',
        slug: 'route-groups',
        description: 'Organize routes without affecting URL paths',
      },
      {
        name: 'Parallel Routes',
        slug: 'parallel-routes',
        description: 'Render multiple pages in the same layout',
      },
    ],
  },
];

