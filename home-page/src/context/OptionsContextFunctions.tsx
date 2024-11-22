
export const handleSnapTypeChange = (dispatch : React.Dispatch<any>, id: number, snapType: string) => {
    dispatch({
        type: 'changeSnapType',
        id: id,
        snapType: snapType,
    });
}
export const handleSnapTypeToggle = (dispatch : React.Dispatch<any>, id: number) => {
    dispatch({
        type: 'toggleSnapType',
        id: id,
    });
}
export const handleGridSizeChange = (dispatch : React.Dispatch<any>, id: number, gridSizeWidth: number, gridSizeHeight: number) => {
    dispatch({
        type: 'changeGridSize',
        id: id,
        gridSizeWidth: gridSizeWidth,
        gridSizeHeight: gridSizeHeight,
    });
}

export const handleStoreCanvasSize = (dispatch : React.Dispatch<any>, width: number, height: number) => {
    dispatch({
        type: 'storeCanvasSize',
        width: width,
        height: height,
    });
}