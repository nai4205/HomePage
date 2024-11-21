import React from 'react';
import { CogIcon } from '@heroicons/react/24/solid';
import { handleSave, handleLoad } from '@/context/WidgetContextFunctions';
import { handleSnapTypeToggle, handleGridSizeChange } from '@/context/OptionsContextFunctions';

export default function Options(dispatch: React.Dispatch<any>, optionsDispatch: React.Dispatch<any>, options: any) {    
    const [showOptions, setShowOptions] = React.useState(false);
    const GRID_SIZE = options[0].gridSize;

    return (
        <div>
    <CogIcon className='top-0 left-0 mr-auto h-6 w-6 text-white cursor-pointer' onClick={() => setShowOptions(!showOptions)}/>
                {showOptions ? (
                <>
                    <button className='bg-white m-1' onClick={() => handleSave(dispatch)}>Save</button>
                    <button className='bg-white' onClick={() => handleLoad(dispatch)}>Load</button>
                    <button className='bg-white mx-1' onClick={() => handleSnapTypeToggle(optionsDispatch, 0)}>Toggle snap</button>
                    <div className="m-1 bg-white w-fit">
                    <label htmlFor="gridSize" className="mr-2">Grid Size:</label>
                    <input
                        id="gridSize"
                        type="range"
                        min="10"
                        max="300"
                        step="10"
                        defaultValue={GRID_SIZE}
                        onChange={(e) => {
                            const newSize = parseInt(e.target.value, 10);
                            handleGridSizeChange(optionsDispatch, 0, newSize);
                        }}
                    />
                    <span className="ml-2">{options[0].gridSize}px</span>
                </div>
                </>
            ) : null}
            </div>
        );
        }