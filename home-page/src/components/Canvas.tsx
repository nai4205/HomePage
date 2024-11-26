'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { widgets as widgetsInitial, type Item } from '@/lib/widgets';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import { WidgetContext } from '@/context/WidgetContext';
import { handleWidgetMove, handleWidgetResize, handleAddHeader, handleLoad, } from '@/context/WidgetContextFunctions';
import { OptionsDispatchContext } from '@/context/OptionsContext';
import { OptionsContext } from '@/context/OptionsContext';
import  { Options } from './Options';
import { handleStoreCanvasSize, handleStoreCanvasPos } from '@/context/OptionsContextFunctions';
import SavedLayout from './SavedLayout';

interface CanvasProps {
    isEditing: boolean;
}

export default function Canvas({ isEditing }: CanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const [storedWidgets, setStoredWidgets] = useState(false);

    let nextId = 0;

    const dispatch = useContext(WidgetDispatchContext);
    const widgets = useContext(WidgetContext);

    const optionsDispatch = useContext(OptionsDispatchContext);
    const options = useContext(OptionsContext);
    
    const GRID_SIZE_WIDTH = options[0]?.gridSizeWidth || 0;
    const GRID_SIZE_HEIGHT = options[0]?.gridSizeHeight || 0;

    useEffect(() => {
        handleStoreCanvasSize(optionsDispatch, canvasRef.current?.clientWidth || 0, canvasRef.current?.clientHeight || 0);
        handleStoreCanvasPos(optionsDispatch, canvasRef.current?.getBoundingClientRect().left || 0, canvasRef.current?.getBoundingClientRect().top || 0);
        handleLoad(dispatch);
    },[]);

    useEffect(() => {
        const handleResize = () => {
            const oldCanvasWidth = options[0].canvasWidth;
            const oldCanvasHeight = options[0].canvasHeight;
            const newCanvasWidth = canvasRef.current?.clientWidth || 0;
            const newCanvasHeight = canvasRef.current?.clientHeight || 0;
            if (oldCanvasWidth === newCanvasWidth && oldCanvasHeight === newCanvasHeight) return;
            handleStoreCanvasSize(optionsDispatch, newCanvasWidth, newCanvasHeight || 0);
            handleStoreCanvasPos(optionsDispatch, canvasRef.current?.getBoundingClientRect().left || 0, canvasRef.current?.getBoundingClientRect().top || 0);
            const ratioWidth = newCanvasWidth / oldCanvasWidth;
            const ratioHeight = newCanvasHeight / oldCanvasHeight;
            widgets.forEach((widget) => {
                handleWidgetMove(dispatch, widget.id, widget.x * ratioWidth, widget.y * ratioHeight);
                handleWidgetResize(dispatch, widget.id, widget.width * ratioWidth, widget.height * ratioHeight);
            });
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [canvasRef.current?.getBoundingClientRect()]);


    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: widgets.map((widget) => widget.name),
        drop: (item: Item, monitor) => {
        const offset = monitor.getClientOffset();
        const canvasBoundingRect = canvasRef.current?.getBoundingClientRect();       
        

        if (offset && canvasBoundingRect) {
        const xPosCanvas = offset.x - canvasBoundingRect.x;
        const yPosCanvas = offset.y - canvasBoundingRect.y; 

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
        <>
        {isEditing ? (
        <DndProvider backend={HTML5Backend}>
            <div ref={canvasRef} className="relative h-dvh w-dvh bg-gray-900" >
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
                {widget.isEditing ? (
                <div className='absolute h-screen' style={{ left: widget.x, top: widget.y-widget.toolBarHeight, width: widget.width, height: widget.height }}>
                {widget.toolBar && <widget.toolBar item={widget} />} 
                </div>
                ) : null}
                </div>
                <div
                    className="absolute h-screen flex flex-col overflow-hidden border border-white"
                    style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
                >
                     
                    <div className='' style={{ width: widget.width, height: widget.height}}>
                        <div ref={(el) => { contentRef.current[widget.id] = el }}>
                        <div>
                        {widget.isEditing && widget.editComponent ? (
                            <widget.editComponent item={widget} />
                        ) : (
                            <widget.component item={widget} />
                        )}
                        </div>
                        </div>
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
        ) : (
            <div ref={canvasRef} className="relative h-dvh w-dvh bg-gray-900">
                <SavedLayout editing={isEditing} />
            </div>
        )}
        </>
    );
    }
