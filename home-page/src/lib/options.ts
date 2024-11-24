export interface Options {
    id: number
    snapType: string;
    gridSizeWidth: number;
    gridSizeHeight: number;
    canvasWidth: number;
    canvasHeight: number;
    canvasLeft: number;
    canvasTop: number;
}

export const options : Options[] = [
    {
    id: 0,
    snapType: 'float',
    gridSizeWidth: 10,
    gridSizeHeight: 10,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasLeft: 0,
    canvasTop: 0,
    },

]