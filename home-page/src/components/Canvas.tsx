import React, { useState, useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { widgets, type Item } from '@/lib/widgets';

const GRID_SIZE = 400; // Define grid size for snapping

export default function Page() {
    const widgetRef = useRef<HTMLDivElement>(null);
    const [canvasWidgets, setCanvasWidgets] = useState<
        { id: string; widget: Item; x: number; y: number; width: number; height: number; sectionId?: string }[]
    >([]);


    // Resize handler that updates only the selected widget's width and height
    const onResize = (e: MouseEvent, startX: number, startY: number, startWidth: number, startHeight: number, id: string) => {
        // Calculate the mouse movement delta (change in position)
        const deltaX = e.clientX - 288 - startX;
        const deltaY = e.clientY - startY;
    
        // Calculate new width and height based on the delta of mouse movement
        var newWidth = Math.max(deltaX, 50); // Minimum width is 50px
        var newHeight = Math.max(deltaY, 50); // Minimum height is 50px
    
        console.log("Start x: ", startX, "Start y: ", startY, "Start width: ", startWidth, "Start height: ", startHeight, "New width: ", newWidth, "New height: ", newHeight);
        console.log("Client x: ", e.clientX, "Client y: ", e.clientY);
    
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
        setCanvasWidgets((prev) =>
        prev.map((widget) =>
            widget.id === id
            ? { ...widget, x: e.clientX - 288, y: e.clientY }
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
        if (offset) {
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
                x: offset.x - 288,
                y: offset.y,
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
        <div
            ref={(element) => {
            if (element) {
                dropRef(element); // Connect react-dnd's ref to this element
            }
            }}
            className="relative w-full h-screen bg-gray-900"
            style={{ border: isOver ? '2px dashed white' : '2px solid transparent' }}
        >
            {canvasWidgets.map(({ widget, x, y, width, height, id }) => (
            <div
                key={id}
                className="absolute"
                style={{ left: x, top: y, width, height, border: '2px solid #4CAF50' }}
            >
                <div style={{ width, height }}>
                {widget.component ? (
                    <widget.component item={widget}/>
                ) : (
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
        </DndProvider>
    );
    }
