import { Header } from '@/widgets/Header/Header';
import { EHeader } from '@/widgets/Header/EHeader';
import { HeaderToolBar } from '@/widgets/Header/HeaderToolBar';
import { Section } from '@/components/Section';

export type WidgetAttributes = {
  border?: string;
  color?: string;
  paragraphText?: string;
  [key: string]: any;
};

export type Item = {
  id: number;
  name: string;
  widgetType?: string;
  description?: string;
  component: React.FC<{ item: Item }>;
  editComponent?: React.FC<{ item: Item }> | null;
  toolBar: React.FC<{ item: Item }> | null;
  toolBarHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  isEditing: boolean;
  attributes?: WidgetAttributes; 
};

export const widgets: { name: string; items: Item[] }[] = [
  {
    name: 'Widgets',
    items: [
      {
        id: -1,
        name: 'Header',
        widgetType: 'Header',
        description: 'Heading widget',
        component: Header,
        editComponent: EHeader,
        toolBar: HeaderToolBar,
        toolBarHeight: 50,
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

