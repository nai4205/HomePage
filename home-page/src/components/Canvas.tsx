'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { widgets as widgetsInitial, type Item } from '@/lib/widgets';
import { useReducer } from 'react';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import { WidgetContext } from '@/context/WidgetContext';
import { handleWidgetMove, handleWidgetResize, handleAddHeader } from '@/context/WidgetContextFunctions';

const GRID_SIZE = 400; // Define grid size for snapping

export default function Page() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    
    let nextId = 0;

    const dispatch = useContext(WidgetDispatchContext);
    const widgets = useContext(WidgetContext);

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
        if (!contentBoundingRect) return;
        var newWidth = Math.min(Math.max(deltaX, contentBoundingRect.width), canvasWidth - startX); 
        var newHeight = Math.min(Math.max(deltaY, contentBoundingRect.height), canvasHeight - startY);
    
        handleWidgetResize(dispatch, id, newWidth, newHeight);
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
        handleWidgetMove(dispatch, id, x, y);
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

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: widgets.map((widget) => widget.name),
        drop: (item: Item, monitor) => {
        const offset = monitor.getClientOffset();
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();

        if (offset && canvasBoundingRect) {
        
        switch (item.name) {
            case 'Header':
                handleAddHeader(dispatch, offset.x - canvasBoundingRect.x, offset.y - canvasBoundingRect.y, nextId);
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
            {widgets.filter(widget => widget.visible).map((widget: Item) => (
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
