import React from 'react';
import { CogIcon } from '@heroicons/react/24/solid';
import { handleSave, handleLoad } from '@/context/WidgetContextFunctions';
import { handleSnapTypeToggle, handleGridSizeChange } from '@/context/OptionsContextFunctions';
import { WidgetContext } from '@/context/WidgetContext';
import { useContext } from 'react';


export const Options: React.FC<{ options: any, dispatch: React.Dispatch<any>, optionsDispatch: React.Dispatch<any> }> = ({ options, dispatch, optionsDispatch }) => {
    const [showOptions, setShowOptions] = React.useState(false);
    const GRID_SIZE = options[0].gridSize;
            const widgets = useContext(WidgetContext);


    function handleWidgetSizeGrid(optionsDispatch: React.Dispatch<any>) {
        const currentWidget = widgets.filter((widget) => widget.isEditing === true);
        if (currentWidget.length === 0) {
            alert('No widget is currently selected.');
            return;
        }
        handleGridSizeChange(optionsDispatch, 0, currentWidget[0].width, currentWidget[0].height);
    }

    function Load() {
        window.location.href = '/homepage';
    }
    

    return (
        <div>
    <CogIcon className='top-0 left-0 mr-auto h-6 w-6 text-white cursor-pointer' onClick={() => setShowOptions(!showOptions)}/>
                {showOptions ? (
                <>
                    <button className='bg-white m-1' onClick={() => handleSave(dispatch)}>Save</button>
                    <button className='bg-white' onClick={() => Load()}>Load</button>
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
                            handleGridSizeChange(optionsDispatch, 0, newSize, newSize);
                        }}
                    />
                    <button className='bg-white' onClick={() => handleWidgetSizeGrid(optionsDispatch)}>Widget size</button>
                    <span className="ml-2">{options[0].gridSizeWidth}x{options[0].gridSizeHeight} px</span>
                </div>
                </>
            ) : null}
            </div>
        );
        }