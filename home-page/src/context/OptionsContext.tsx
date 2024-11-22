'use client';
import { createContext, useReducer } from "react";
import { options as optionsInitial, Options} from "@/lib/options";

export const OptionsContext = createContext<Options[]>([]);
export const OptionsDispatchContext = createContext<React.Dispatch<any>>(() => null);

export function OptionsProvider({children} : any){

    const initialOptions : Options[] = optionsInitial;

    const [options, dispatch] = useReducer<React.Reducer<Options[], any>>(
            optionsReducer,
            initialOptions
        );

    return (
        <OptionsContext.Provider value={options}>
            <OptionsDispatchContext.Provider value={dispatch}>
                {children}
            </OptionsDispatchContext.Provider>
        </OptionsContext.Provider>
    )
}

function optionsReducer(options: Options[], action: any) {
    switch (action.type) {
        case 'changeSnapType':
            return options.map((option) =>
                option.id === action.id
                    ? { ...option, snapType: action.snapType, gridSizeWidth: option.gridSizeWidth, gridSizeHeight: option.gridSizeHeight }
                    : option
            );  
        case 'toggleSnapType':
            return options.map((option) =>
                option.id === action.id
                    ? { ...option, snapType: option.snapType === 'float' ? 'grid' : 'float', gridSizeWidth: option.gridSizeWidth, gridSizeHeight: option.gridSizeHeight }
                    : option
            );
        case 'changeGridSize':
            return options.map((option) =>
                option.id === action.id
                    ? { ...option, gridSizeWidth: action.gridSizeWidth, gridSizeHeight: action.gridSizeHeight }
                    : option
            );
        case 'storeCanvasSize':
            return options.map((option) =>
                option.id === 0
                    ? { ...option, canvasWidth: action.width, canvasHeight: action.height }
                    : option
            );
        default:
            throw Error('Unknown action type' + action.type);
    }
}