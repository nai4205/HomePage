'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { widgets as widgetsInitial, type Item } from '@/lib/widgets';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import { WidgetContext } from '@/context/WidgetContext';
import { handleWidgetMove, handleWidgetResize, handleAddHeader, } from '@/context/WidgetContextFunctions';
import { OptionsDispatchContext } from '@/context/OptionsContext';
import { OptionsContext } from '@/context/OptionsContext';
import  { Options } from './Options';
import { handleStoreCanvasSize } from '@/context/OptionsContextFunctions';


export default function Page() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<{ [key: number]: HTMLDivElement | null }>({});


    let nextId = 0;

    const dispatch = useContext(WidgetDispatchContext);
    const widgets = useContext(WidgetContext);

    const optionsDispatch = useContext(OptionsDispatchContext);
    const options = useContext(OptionsContext);
    
    const GRID_SIZE_WIDTH = options[0]?.gridSizeWidth || 0;
    const GRID_SIZE_HEIGHT = options[0]?.gridSizeHeight || 0;

    useEffect(() => {
        handleStoreCanvasSize(optionsDispatch, canvasRef.current?.clientWidth || 0, canvasRef.current?.clientHeight || 0);
    },[]);

    useEffect(() => {
        const handleResize = () => {
            const oldCanvasWidth = options[0].canvasWidth;
            const oldCanvasHeight = options[0].canvasHeight;
            const newCanvasWidth = canvasRef.current?.clientWidth || 0;
            const newCanvasHeight = canvasRef.current?.clientHeight || 0;
            if (oldCanvasWidth === newCanvasWidth && oldCanvasHeight === newCanvasHeight) return;
            handleStoreCanvasSize(optionsDispatch, newCanvasWidth, newCanvasHeight || 0);
            const ratioWidth = newCanvasWidth / oldCanvasWidth;
            const ratioHeight = newCanvasHeight / oldCanvasHeight;
            widgets.forEach((widget) => {
                handleWidgetMove(dispatch, widget.id, widget.x * ratioWidth, widget.y * ratioHeight);
                handleWidgetResize(dispatch, widget.id, widget.width * ratioWidth, widget.height * ratioHeight);
            });
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [canvasRef.current?.getBoundingClientRect(), options, widgets, dispatch, optionsDispatch]);


    // Resize handler that updates only the selected widget's width and height
    const onResize = (e: MouseEvent, startX: number, startY: number, startWidth: number, startHeight: number, id: number) => {
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();
        const contentBoundingRect = contentRef.current[id]?.getBoundingClientRect();
        const canvasWidth = canvasBoundingRect?.width || 0;
        const canvasHeight = canvasBoundingRect?.height || 0;
        const snapType = options[0].snapType;

        // Calculate the mouse movement delta (change in position)
        if (!canvasBoundingRect) return;
        const deltaX = e.clientX - canvasBoundingRect.left - startX;
        const deltaY = e.clientY - canvasBoundingRect.top - startY;
    
        // Calculate new width and height based on the delta of mouse movement

        if (!contentBoundingRect) return;
        var newWidth = Math.min(Math.max(deltaX, contentBoundingRect.width), canvasWidth - startX); 
        var newHeight = Math.min(Math.max(deltaY, contentBoundingRect.height), canvasHeight - startY);
        if(snapType === 'grid'){
            var newWidth = Math.max(Math.floor(newWidth / GRID_SIZE_WIDTH) * GRID_SIZE_WIDTH, contentBoundingRect.width);
            var newHeight = Math.max(Math.floor(newHeight / GRID_SIZE_HEIGHT) * GRID_SIZE_HEIGHT, contentBoundingRect.height);
        }

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
        const snapType = options[0].snapType;
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();
        const widget = widgets.find((widget) => widget.id === id);
        if (!canvasBoundingRect || !widget) return
        switch (snapType){
            case 'float':
                var x =  Math.max(0, Math.min(e.clientX - canvasBoundingRect.left, canvasBoundingRect.width - widget.width))
                var y = Math.max(0, Math.min(e.clientY - canvasBoundingRect.top, canvasBoundingRect.height - widget.height))
                break;
            case 'grid':
                x = Math.floor((e.clientX - canvasBoundingRect.left) / GRID_SIZE_WIDTH) * GRID_SIZE_WIDTH;
                y = Math.floor((e.clientY - canvasBoundingRect.top) / GRID_SIZE_HEIGHT) * GRID_SIZE_HEIGHT;
                x = Math.max(0, Math.min(x, canvasBoundingRect.width - widget.width));
                y = Math.max(0, Math.min(y, canvasBoundingRect.height - widget.height));
                break;
            default:
                break;
        }
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
        const xPosCanvas = offset.x - canvasBoundingRect.x;
        const yPosCanvas = offset.y - canvasBoundingRect.y; 
        const xPercentage = xPosCanvas / canvasBoundingRect.width;
        const yPercentage = yPosCanvas / canvasBoundingRect.height;

        switch (options[0].snapType){
            case 'float':
                switch (item.name) {
                    case 'Header':
                        handleAddHeader(dispatch, xPosCanvas, yPosCanvas, nextId);
                        break;
                    default:
                        break;
                
                }
                break;
            case 'grid':
                switch (item.name) {
                    case 'Header':
                        handleAddHeader(dispatch, Math.floor((offset.x - canvasBoundingRect.x) / GRID_SIZE_WIDTH) * GRID_SIZE_WIDTH, Math.floor((offset.y - canvasBoundingRect.y) / GRID_SIZE_HEIGHT) * GRID_SIZE_HEIGHT, nextId);
                        break;
                    default:
                        break;
                }
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
            <div ref={canvasRef} className="relative mx-auto flex-1 h-screen bg-gray-900" >
            <div className='bg-gray-700'>
            <Options options={options} dispatch={dispatch} optionsDispatch={optionsDispatch} />
            </div>
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
                <div key={widget.id}>
                <div>
                {widget.toolBar && widget.isEditing ? (
                    <div className='absolute h-screen' style={{left: widget.x, top: widget.y - 40, width: widget.width, height: widget.height}}>
                        <div style={{ border: '2px solid #4CAF50' }} className='w-full'>
                        <widget.toolBar item={widget} />
                        </div>
                    </div>
                    ) : null}
                </div>
                <div
                    className="absolute h-screen"
                    style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
                >
                    <div className='absolute flex-row' style={{ width: widget.width, height: widget.height, border: '1px solid white' }}>
                        <div ref={(el) => { contentRef.current[widget.id] = el }} className='absolute flex-auto'>
                        <div>
                        {widget.component ? (
                            <div>
                            <widget.component item={widget} />
                            </div>
                        ) : (
                            <div className="text-white">{widget.name}</div>
                        )}
                        </div>
                        </div>
                    {widget.isEditing ? (
                        <>
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
                        </>
                    ) : null}
                    </div>
                </div>
                </div>
                ))}
            </div>
            {options[0].snapType === 'grid' && (
        <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: Math.floor((canvasRef.current?.clientHeight ?? 0) / GRID_SIZE_HEIGHT) }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="absolute w-full border-t border-gray-700 opacity-30"
                    style={{ top: rowIndex * GRID_SIZE_HEIGHT }}
                />
            ))}
            {Array.from({ length: Math.floor((canvasRef.current?.clientWidth ?? 0) / GRID_SIZE_WIDTH) }).map((_, colIndex) => (
                <div
                    key={colIndex}
                    className="absolute h-full border-l border-gray-700 opacity-30"
                    style={{ left: colIndex * GRID_SIZE_WIDTH }}
                />
                ))}
            </div>
            )}
            </div>
        </DndProvider>
    );
    }
