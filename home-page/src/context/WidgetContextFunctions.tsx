'use client';

export const handleWidgetMove = (dispatch : React.Dispatch<any>, id: number, x: number, y: number) => {
    dispatch({
        type: 'move',
        id: id,
        x: x,
        y: y,
    });
};

export const handleWidgetResize = (dispatch : React.Dispatch<any>, id: number, width: number, height: number) => {
    dispatch({
        type: 'resize',
        id: id,
        width: width,
        height: height,
    });
};

export const handleAddHeader = (dispatch : React.Dispatch<any>, x : number, y : number, nextId: number) => {
    dispatch({
        type: 'addedHeader',
        id: new Date().getTime(),
        name: 'Header',
        x: x,
        y: y,
        width: 200,
        height: 100,
        visible: true,
    });
}

export const handleRemoveById = (dispatch : React.Dispatch<any>, id: number) => {
    dispatch({
        type: 'removeById',
        id: id,
    });
}