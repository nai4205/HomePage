'use client';
import { createContext, useReducer } from "react";
import { widgets as widgetsInitial, Item } from "@/lib/widgets";

export const WidgetContext = createContext<Item[]>([]);
export const WidgetDispatchContext = createContext<React.Dispatch<any>>(() => null);

export function WidgetProvider({children} : any){
    const initialWidgets : Item[] = widgetsInitial[0].items;

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
        case 'remove':
            return widgets.filter((widget) => widget.id !== action.payload);
        case 'removeById':
            return widgets.filter((widget) => widget.id !== action.id);
        default:
            throw Error('Unknown action type' + action.type);
    }
}