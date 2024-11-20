import React, { useState, useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { widgets, type Item } from '@/lib/widgets';

const GRID_SIZE = 400; // Define grid size for snapping

export default function Page() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [canvasWidgets, setCanvasWidgets] = useState<
        { id: string; widget: Item; x: number; y: number; width: number; height: number; sectionId?: string }[]
    >([]);


    // Resize handler that updates only the selected widget's width and height
    const onResize = (e: MouseEvent, startX: number, startY: number, startWidth: number, startHeight: number, id: string) => {
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
        console.log("New width: ", newWidth, "New height: ", newHeight);
        console.log("deltaX: ", deltaX, "deltaY: ", deltaY, "contentBoundingRect width: ", contentBoundingRect?.width, "contentBoundingRect height: ", contentBoundingRect?.height);
        console.log("Canvas width: ", canvasWidth, "Canvas height: ", canvasHeight);
        console.log("startX: ", startX, "startY: ", startY);

        // console.log("Start x: ", startX, "Start y: ", startY, "Start width: ", startWidth, "Start height: ", startHeight, "New width: ", newWidth, "New height: ", newHeight);
        // console.log("Client x: ", e.clientX, "Client y: ", e.clientY);
    
        setCanvasWidgets((prev) =>
            prev.map((widget) =>
                widget.id === id
                    ? { ...widget, width: newWidth, height: newHeight }
                    : widget
            )
        );
    };
    
    
    // Start resizing by tracking the initial position and dimensions
    const onResizeStart = (
        e: React.MouseEvent,
        widgetId: string,
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

    const onMove = (e: MouseEvent, id: string) => {
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasBoundingRect) return

        setCanvasWidgets((prev) =>
            prev.map((widget) =>
            widget.id === id
                ? {
                ...widget,
                x: Math.max(0, Math.min(e.clientX - canvasBoundingRect.left, canvasBoundingRect.width - widget.width)),
                y: Math.max(0, Math.min(e.clientY - canvasBoundingRect.top, canvasBoundingRect.height - widget.height))
                }
                : widget
            )
        );
    }

    const onMoveStart = (
        e: React.MouseEvent,
        widgetId: string,
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
        accept: widgets.flatMap((section) => section.items.map((item) => item.name)),
        drop: (item: Item, monitor) => {
        const offset = monitor.getClientOffset();
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();

        if (offset && canvasBoundingRect) {
            
            const snapX = Math.floor(offset.x / GRID_SIZE) * GRID_SIZE;
            const snapY = Math.floor(offset.y / GRID_SIZE) * GRID_SIZE;

        if(item.name === 'Section') {
            // Otherwise, place it normally on the canvas
            setCanvasWidgets((prev) => [
                ...prev,
                {
                id: `${item.name}-${Date.now()}`,
                widget: item,
                x: snapX,
                y: snapY,
                width: 200, // Default width for regular widgets
                height: 100, // Default height for regular widgets
                },
            ]);
        }
        else{
            // Otherwise, place it normally on the canvas
            setCanvasWidgets((prev) => [
                ...prev,
                {
                id: `${item.name}-${Date.now()}`,
                widget: item,
                x: offset.x - canvasBoundingRect.left,
                y: offset.y - canvasBoundingRect.top,
                width: 200, // Default width for regular widgets
                height: 100, // Default height for regular widgets
                        },
                    ]);
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
            {canvasWidgets.map(({ widget, x, y, width, height, id }) => (
            <div
                key={id}
                className="absolute h-screen"
                style={{ left: x, top: y, width, height, border: '2px solid #4CAF50' }}
            >
                <div className='absolute' style={{ width, height }}>
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
                    onResizeStart(e, id, x, y, width, height) // Start resizing the specific widget
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
                    onMoveStart(e, id) // Start resizing the specific widget
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
