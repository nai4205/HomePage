import React, { useContext } from "react";
import { handleWidgetMove } from "@/context/WidgetContextFunctions";
import { WidgetContext, WidgetDispatchContext } from "@/context/WidgetContext";
import { OptionsContext } from "@/context/OptionsContext";

interface MoveComponentProps {
    item: any;
}

const MoveComponent: React.FC<MoveComponentProps> = ({
   item,
}) => {
    const widget = item
    const id = item.id

    const options = useContext(OptionsContext);

    const dispatch = useContext(WidgetDispatchContext);

    const canvasWidth = options[0].canvasWidth;
    const canvasHeight = options[0].canvasHeight;
    const snapType = options[0].snapType;
    const GRID_SIZE_WIDTH = options[0].gridSizeWidth;
    const GRID_SIZE_HEIGHT = options[0].gridSizeHeight;

    const canvasTop = options[0].canvasTop;
    const canvasLeft = options[0].canvasLeft;

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const initialX = e.clientX - widget.x;
        const initialY = e.clientY - widget.y;

        const onMouseMove = (e: MouseEvent) => {
            if (!widget) return;
            let x, y;
            switch (snapType) {
                case 'float':
                    x = Math.max(0, Math.min(e.clientX - initialX, canvasWidth - widget.width));
                    y = Math.max(0, Math.min(e.clientY - initialY, canvasHeight - widget.height));
                    break;
                case 'grid':
                    x = Math.floor((e.clientX - initialX) / GRID_SIZE_WIDTH) * GRID_SIZE_WIDTH;
                    y = Math.floor((e.clientY - initialY) / GRID_SIZE_HEIGHT) * GRID_SIZE_HEIGHT;
                    x = Math.max(0, Math.min(x, canvasWidth - widget.width));
                    y = Math.max(0, Math.min(y, canvasHeight - widget.height));
                    break;
                default:
                    break;
            }
            handleWidgetMove(dispatch, id, x, y);
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
        className="w-full h-full"
        style={{cursor: 'se-resize',}}
        onMouseDown={(e) =>
        onMove(e)
        }
    />
    );
};

export default MoveComponent;