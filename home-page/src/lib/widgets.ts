import { Header } from '@/widgets/Header';
import { Section } from '@/components/Section';

export type Item = {
  id: number;
  name: string;
  description?: string;
  component?: React.FC<{ item: Item  }>; 
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}

export const widgets: { name: string; items: Item[] }[] = [
  {
    name: 'Widgets',
    items: [
      {
        id: -1,
        name: 'Header',
        description: 'Heading widget',
        component: Header,
        x: 0,
        y: 0,
        width: 250,
        height: 100,
        visible: false,
      },
    ],
  },
];

