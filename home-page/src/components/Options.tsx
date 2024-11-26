import React, { useEffect, useState } from 'react';
import { CogIcon } from '@heroicons/react/24/solid';
import { handleSave, handleLoad } from '@/context/WidgetContextFunctions';
import { handleSnapTypeToggle, handleGridSizeChange } from '@/context/OptionsContextFunctions';
import { WidgetContext } from '@/context/WidgetContext';
import { useContext } from 'react';

export const Options: React.FC<{ options: any, dispatch: React.Dispatch<any>, optionsDispatch: React.Dispatch<any> }> = ({ options, dispatch, optionsDispatch }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [snapType, setSnapType] = useState(false);

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

    function handleSnapType() {
        setSnapType(!snapType);
        handleSnapTypeToggle(optionsDispatch, 0);
    }

    function Load() {
        window.location.href = '/homepage';
    }

    return (
        <div className='relative bg-gray-900'>
            <CogIcon className='w-6 text-white cursor-pointer' onClick={() => setShowOptions(!showOptions)} />
            {showOptions && (
                <div className='absolute mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10'>
                    <div className='py-1'></div>
                    <button className='block px-4 py-2 text-white text-sm hover:bg-gray-700 w-full text-left' onClick={() => handleSave(dispatch)}>Save</button>
                    <button className='block px-4 py-2 text-white text-sm hover:bg-gray-700 w-full text-left' onClick={() => Load()}>Load</button>
                    <button
                        className={`block px-4 py-2 text-white text-sm w-full text-left ${snapType ? 'bg-gray-1000' : 'hover:bg-gray-700'}`}
                        onClick={() => handleSnapType()}
                    >
                        Toggle snap
                    </button>
                    {snapType && (
                        <div className=''>
                            <div className='px-4 py-2'></div>
                            <label htmlFor="gridSize" className='block text-sm text-white'>Grid Size:</label>
                            <input
                                id="gridSize"
                                type="range"
                                min="10"
                                max="300"
                                step="10"
                                defaultValue={GRID_SIZE}
                                className='w-full mt-1'
                                onChange={(e) => {
                                    const newSize = parseInt(e.target.value, 10);
                                    handleGridSizeChange(optionsDispatch, 0, newSize, newSize);
                                }}
                            />
                            <span className='block text-sm text-white mt-1'>{options[0].gridSizeWidth}x{options[0].gridSizeHeight} px</span>
                            <button className='block w-full px-4 py-2 mt-2 text-sm text-white border hover:bg-gray-700 text-left' onClick={() => handleWidgetSizeGrid(optionsDispatch)}>Widget size</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}