'use client';
import { createContext, useReducer } from "react";
import { widgets as widgetsInitial, Item } from "@/lib/widgets";
import { useRef } from "react";

export const WidgetContext = createContext<Item[]>([]);
export const WidgetDispatchContext = createContext<React.Dispatch<any>>(() => null);

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
        
        case 'addedHeader':
            return [...widgets, {
                id: action.id,
                name: action.name,
                x: action.x,
                y: action.y,
                width: action.width,
                height: action.height,
                component: widgets.find((widget) => widget.name === action.name)?.component,
                visible: action.visible,
               
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
            const savedWidgets = localStorage.getItem('widgets');
            if (savedWidgets) {
                const parsedWidgets = JSON.parse(savedWidgets);
                return parsedWidgets.map((widget: Item) => ({
                    ...widget,
                    component: widgets.find((w) => w.name === widget.name)?.component,
                }));
            }
            return widgetsInitial[0].items;
        default:
            throw Error('Unknown action type' + action.type);
    }
}