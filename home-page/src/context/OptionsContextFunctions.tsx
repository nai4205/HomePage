
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
export const handleGridSizeChange = (dispatch : React.Dispatch<any>, id: number, gridSize: number) => {
    dispatch({
        type: 'changeGridSize',
        id: id,
        gridSize: gridSize,
    });
}