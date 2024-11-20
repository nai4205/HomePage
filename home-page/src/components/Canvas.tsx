import React, { useState, useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { widgets as widgetsInitial, type Item } from '@/lib/widgets';
import { useReducer } from 'react';

const GRID_SIZE = 400; // Define grid size for snapping

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
               
            }];
        case 'remove':
            return widgets.filter((widget) => widget.id !== action.payload);
        case 'removeById':
            return widgets.filter((widget) => widget.id !== action.id);
        default:
            throw Error('Unknown action type' + action.type);
    }
}

export default function Page() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    
    let nextId = 4;
    const initialWidgets : Item[] = widgetsInitial[0].items;
    console.log(initialWidgets);

    const [widgets, dispatch] = useReducer<React.Reducer<Item[], any>>(
            widgetReducer,
            initialWidgets
        );



    // Resize handler that updates only the selected widget's width and height
    const onResize = (e: MouseEvent, startX: number, startY: number, startWidth: number, startHeight: number, id: number) => {
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();
        const contentBoundingRect = contentRef.current?.getBoundingClientRect();

        // Calculate the mouse movement delta (change in position)
        if (!canvasBoundingRect) return;
        const deltaX = e.clientX - canvasBoundingRect.left - startX;
        const deltaY = e.clientY - canvasBoundingRect.top - startY;
    
        // Calculate new width and height based on the delta of mouse movement
        const canvasWidth = canvasBoundingRect.width;
        const canvasHeight = canvasBoundingRect.height;
        var newWidth = Math.min(Math.max(deltaX, contentBoundingRect?.width), canvasWidth - startX); 
        var newHeight = Math.min(Math.max(deltaY, contentBoundingRect?.height), canvasHeight - startY);
    
        handleWidgetResize(id, newWidth, newHeight);
    };
    
    
    // Start resizing by tracking the initial position and dimensions
    const onResizeStart = (
        e: React.MouseEvent,
        widgetId: number,
        startX: number,
        startY: number,
        startWidth: number,
        startHeight: number
    ) => {
        e.preventDefault();

        const onMouseMove = (e: MouseEvent) =>
        onResize(e, startX, startY, startWidth, startHeight, widgetId);

        const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMove = (e: MouseEvent, id: number) => {
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();
        const widget = widgets.find((widget) => widget.id === id);
        if (!canvasBoundingRect || !widget) return
        var x =  Math.max(0, Math.min(e.clientX - canvasBoundingRect.left, canvasBoundingRect.width - widget.width))
        var y = Math.max(0, Math.min(e.clientY - canvasBoundingRect.top, canvasBoundingRect.height - widget.height))
        handleWidgetMove(id, x, y);
    }

    const onMoveStart = (
        e: React.MouseEvent,
        widgetId: number,
    ) => {
        e.preventDefault();

        const onMouseMove = (e: MouseEvent) =>
        onMove(e, widgetId);

        const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function handleAddHeader(x : number, y : number) {
        dispatch({
            type: 'addedHeader',
            id: nextId++,
            name: 'Header',
            x: x,
            y: y,
            width: 200,
            height: 200,
        });
    }

    function handleWidgetMove(id: number, x: number, y: number) {
        dispatch({
            type: 'move',
            id: id,
            x: x,
            y: y,
        });
    }

    function handleWidgetResize(id: number, width: number, height: number) {
        dispatch({
            type: 'resize',
            id: id,
            width: width,
            height: height,
        });
    }
    

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: widgets.map((widget) => widget.name),
        drop: (item: Item, monitor) => {
        const offset = monitor.getClientOffset();
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();

        if (offset && canvasBoundingRect) {
        switch (item.name) {
            case 'Header':
                handleAddHeader(offset.x - canvasBoundingRect.x, offset.y - canvasBoundingRect.y);
                break;
            default:
                break;
        }
        }
        },
        collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <DndProvider backend={HTML5Backend}>
        <div ref={canvasRef} className="relative mx-auto flex-1 h-screen bg-gray-900">
        <div
            ref={(element) => {
            if (element) {
                dropRef(element); // Connect react-dnd's ref to this element
            }
            }}
            className="flex-1 h-full"
            style={{ border: isOver ? '2px dashed white' : '2px solid transparent' }}
        >
            {widgets.map( (widget : Item) => (
            <div
                key={widget.id}
                className="absolute h-screen"
                style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height, border: '2px solid #4CAF50' }}
            >
                <div className='absolute' style={{ width: widget.width, height: widget.height }}>
                {widget.component ? (
                    <div ref={contentRef} className='absolute'>
                    <widget.component item={widget}/>
                    </div>
                ) : 
                (
                    <div className="text-white">{widget.name}</div>
                )}

                <div
                    style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '10px',
                    height: '10px',
                    cursor: 'se-resize',
                    backgroundColor: 'gray',
                    }}
                    onMouseDown={(e) => 
                    onResizeStart(e, widget.id, widget.x, widget.y, widget.width, widget.height) // Start resizing the specific widget
                    }
                />
                <div
                    style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '10px',
                    height: '10px',
                    cursor: 'se-resize',
                    backgroundColor: 'gray',
                    }}
                    onMouseDown={(e) =>
                    onMoveStart(e, widget.id) // Start resizing the specific widget
                    }
                />
                </div>
            </div>
            ))}
        </div>
        </div>
        </DndProvider>
    );
    }
