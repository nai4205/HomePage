import { Header } from '@/widgets/Header/Header';
import { EHeader } from '@/widgets/Header/EHeader';
import { HeaderToolBar } from '@/widgets/Header/HeaderToolBar';
import { Section } from '@/components/Section';

export type Item = {
  id: number;
  name: string;
  description?: string;
  component: React.FC<{ item: Item  }>; 
  editComponent: React.FC<{ item: Item}>;
  toolBar: React.FC<{ item: Item }>;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  isEditing: boolean;
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
        editComponent: EHeader,
        toolBar: HeaderToolBar,
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        visible: false,
        isEditing: false,
      },
    ],
  },
];

