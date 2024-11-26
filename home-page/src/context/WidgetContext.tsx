'use client';
import { createContext, useReducer } from "react";
import { widgets as widgetsInitial, Item } from "@/lib/widgets";
import { useRef } from "react";
import { Header } from '@/widgets/Header/Header';
import { HeaderToolBar } from "@/widgets/Header/HeaderToolBar";
import { EHeader } from "@/widgets/Header/EHeader";


export const WidgetContext = createContext<Item[]>([]);
export const WidgetDispatchContext = createContext<React.Dispatch<any>>(() => null);

const widgetComponents: { [key: string]: React.FC<{ item: Item }>; } = {
    Header: Header,
    EHeader: EHeader,
    HeaderToolBar: HeaderToolBar,
};

function componentByType(type: string){
    const component = widgetComponents[type];   
    const editComponent = widgetComponents['E' + type];
    const toolBar = widgetComponents[type + 'ToolBar'];
    return {component, editComponent, toolBar};       
}

export function WidgetProvider({children} : any){
    const initialWidgets : Item[] = widgetsInitial[0].items;
    const widgetRefs = useRef({});

    const [widgets, dispatch] = useReducer<React.Reducer<Item[], any>>(
            widgetReducer,
            initialWidgets
        );

    return (
        <WidgetContext.Provider value={widgets}>
            <WidgetDispatchContext.Provider value={dispatch}>
                {children}
            </WidgetDispatchContext.Provider>
        </WidgetContext.Provider>
    )
}

function widgetReducer(widgets: Item[], action: any) {
    switch (action.type) {
        case 'move':
            return widgets.map((widget) =>
                widget.id === action.id
                    ? { ...widget, x: action.x, y: action.y }
                    : widget
            );
        case 'resize':
            return widgets.map((widget) =>
                widget.id === action.id
                    ? { ...widget, width: action.width, height: action.height }
                    : widget
            );
        case 'setWidgets':
            return action.payload;
        
        case 'addedHeader':
            return [...widgets, {
                id: action.id,
                name: action.name,
                widgetType: action.widgetType,
                x: action.x,
                y: action.y,
                width: action.width,
                height: action.height,
                component: componentByType(action.widgetType).component,
                toolBar: widgets.find((widget) => widget.name === action.name)?.toolBar,
                toolBarHeight: widgets.find((widget) => widget.name === action.name)?.toolBarHeight,
                visible: action.visible,
                isEditing: action.isEditing,
            }];
        case 'updateText':
            return widgets.map((widget) =>
                widget.id === action.id
                    ? { ...widget, name: action.text }
                    : widget
            );
        case 'changeComponent':
            return widgets.map((widget) =>
                widget.id === action.id
                    ? { ...widget, component: action.component }
                    : widget
            );
        case 'isEditing':
            return widgets.map((widget) =>
                widget.id === action.id
                    ? { ...widget, isEditing: action.isEditing }
                    : { ...widget, isEditing: false }
            );
        case 'refresh':
            return widgets.map((widget) => widget);
        case 'remove':
            return widgets.filter((widget) => widget.id !== action.payload);
        case 'removeById':
            return widgets.filter((widget) => widget.id !== action.id);
        case 'save':
            localStorage.setItem('widgets', JSON.stringify(widgets));
            return widgets;
        case 'load':    
            const storedWidgets = JSON.parse(localStorage.getItem('widgets') || '[]');
            console.log(storedWidgets);
            return storedWidgets
                .filter((widget: Item) => widget.id !== -1)
                .map((widget: Item) => ({
                    ...widget,
                    component: componentByType(widget.widgetType).component,
                    editComponent: componentByType(widget.widgetType).editComponent,
                    toolBar: componentByType(widget.widgetType).toolBar,
                }));
        default:
            throw Error('Unknown action type' + action.type);
    }
}