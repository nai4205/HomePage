import React, { useState } from "react";
import { handleWidgetResize } from "@/context/WidgetContextFunctions";
import { WidgetContext, WidgetDispatchContext } from "@/context/WidgetContext";
import { useContext } from "react";
import { OptionsContext } from "@/context/OptionsContext";

interface ResizeComponentProps {
    contentWidth: number;
    contentHeight: number;
}

const ResizeComponent: React.FC<ResizeComponentProps> = ({
    contentWidth,
    contentHeight,
}) => {


    const widgets = useContext(WidgetContext);
    const activeWidget = widgets.filter((widget) => widget.isEditing === true);
    const widgetId = activeWidget[0].id;
    const startX = activeWidget[0].x;
    const startY = activeWidget[0].y;

    const options = useContext(OptionsContext);

    const dispatch = useContext(WidgetDispatchContext);

    const canvasWidth = options[0].canvasWidth;
    const canvasHeight = options[0].canvasHeight;
    const snapType = options[0].snapType;
    const GRID_SIZE_WIDTH = options[0].gridSizeWidth;
    const GRID_SIZE_HEIGHT = options[0].gridSizeHeight;

    const canvasTop = options[0].canvasTop;
    const canvasLeft = options[0].canvasLeft;

    const onResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const onMouseMove = (moveEvent: MouseEvent) => {
            // Calculate the mouse movement delta (change in position)
            const deltaX = moveEvent.clientX - canvasLeft - startX;
            const deltaY = moveEvent.clientY - canvasTop - startY;

            // Calculate new width and height based on the delta of mouse movement
            let newWidth = Math.max(Math.min(deltaX, canvasWidth - startX), contentWidth);
            let newHeight = Math.max(Math.min(deltaY, canvasHeight - startY), contentHeight);

            if (snapType === 'grid') {
                newWidth = Math.max(Math.floor(newWidth / GRID_SIZE_WIDTH) * GRID_SIZE_WIDTH, contentWidth);
                newHeight = Math.max(Math.floor(newHeight / GRID_SIZE_HEIGHT) * GRID_SIZE_HEIGHT, contentHeight);
            }

            console.log(newWidth, newHeight);
            handleWidgetResize(dispatch, widgetId, newWidth, newHeight);
        };

        const onMouseUp = (upEvent: MouseEvent) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div    
        style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
        width: '10px',
        height: '10px',
        cursor: 'se-resize',
        backgroundColor: 'gray',
        }}
        onMouseDown={(e) =>
        onResize(e)
        }
    />
    );
};

export default ResizeComponent;