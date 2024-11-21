'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Item } from '@/lib/widgets';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import { handleChangeComponent } from '@/context/WidgetContextFunctions';
import { handleRemoveById, handleWidgetResize, handleIsEditing } from '@/context/WidgetContextFunctions';
import { Header } from '@/widgets/Header/Header';

export const EHeader: React.FC<{ item: Item }> = ({ item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(item.name);
    const dispatch = useContext(WidgetDispatchContext);
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(item.isEditing == false){
            handleChangeComponent(dispatch, item.id, Header);
        }
    }
    , [item.isEditing]);

    useEffect(() => {
        if(!ref.current || !item) return;
        if(item.width < ref.current?.clientWidth || item.height < ref.current?.clientHeight){
            handleWidgetResize(dispatch, item.id, ref.current?.clientWidth || 0, ref.current?.clientHeight || 0);
        }
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

    

    return (
        <div className='p-3 flex-auto w-full' ref={ref}>
            
            <div onDoubleClick={handleDoubleClick} className='mt-2'>
                {isEditing ? (
                    <div>
                        <textarea
                            value={currentText}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            autoFocus
                            className='w-full h-full flex-auto p-2 border'
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