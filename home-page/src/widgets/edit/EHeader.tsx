'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Item } from '@/lib/widgets';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import { handleChangeComponent } from '@/context/WidgetContextFunctions';
import { handleRemoveById, handleWidgetResize } from '@/context/WidgetContextFunctions';
import { Header } from '@/widgets/Header';
import { TrashIcon, CheckIcon } from '@heroicons/react/24/solid';

export const EHeader: React.FC<{ item: Item }> = ({ item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(item.name);
    const dispatch = useContext(WidgetDispatchContext);
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        handleWidgetResize(dispatch, item.id, ref.current?.clientWidth || 0, ref.current?.clientHeight || 0);
    }, []);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentText(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            saveText();
        }
    };

    const handleBlur = () => {
        saveText();
    };

    const saveText = () => {
        if (currentText.trim() === '') {
            return;
        }
        dispatch({
            type: 'updateText',
            id: item.id,
            text: currentText,
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        handleRemoveById(dispatch, item.id);
    };

    const handleApply = () => {
        handleChangeComponent(dispatch, item.id, Header);
    };

    return (
        <div className='p-3 flex-1 w-full' ref={ref}>
            <div className='flex justify-between items-center bg-gray-300 p-2 border-b'>
                <button onClick={handleDelete} className='text-red-500'><TrashIcon className="block w-6 text-gray-400"/>
                </button>
                <button onClick={handleApply} className='mt-2 p-2 bg-blue-500 text-white'><CheckIcon className='block w-6 text-gray-400'/></button>
            </div>
            <div onDoubleClick={handleDoubleClick} className='mt-2'>
                {isEditing ? (
                    <div>
                        <textarea
                            value={currentText}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            autoFocus
                            className='w-full h-full flex-1 p-2 border'
                        />
                    </div>
                ) : (
                    <h1 className='text-white'>{item.name}</h1>
                )}
            </div>
        </div>
    );
};

export default EHeader;