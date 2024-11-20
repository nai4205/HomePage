import { Header } from '@/components/Header';
import { Section } from '@/components/Section';

export type Item = {
  name: string;
  slug: string;
  description?: string;
  component?: React.FC<{ item: Item  }>; 
  width?: number;
  height?: number;
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
        width: 200,
        height: 100,
      },
      {
        name: 'Section',
        slug: 'route-groups',
        description: 'Organize routes without affecting URL paths',
        component: Section,
      },
      {
        name: 'Parallel Routes',
        slug: 'parallel-routes',
        description: 'Render multiple pages in the same layout',
      },
    ],
  },
];

