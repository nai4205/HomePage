'use client';
import React, { useState, useContext, useEffect, use } from 'react';
import { Item } from '@/lib/widgets';
import { WidgetDispatchContext, WidgetContext } from '@/context/WidgetContext';
import { handleChangeComponent } from '@/context/WidgetContextFunctions';
import { Header } from '@/widgets/Header/Header';
import ResizeComponent from '@/utils/resize';
import MoveComponent from '@/utils/move';
import { OptionsContext } from '@/context/OptionsContext';
import { HeaderText } from './HeaderText';

export const EHeader: React.FC<{ item: Item }> = ({ item }) => {

    console.log(item);
    if (!item) return null;

    
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(item.name);
    const dispatch = useContext(WidgetDispatchContext);
    
    useEffect(() => {
        if(item.isEditing == false){
            handleChangeComponent(dispatch, item.id, Header);
        }
    }
    , [item.isEditing]);


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
    console.log("item", item, "isEditing", item.isEditing);
    

    return (
        <div className='static' style={{width: item.width, height: item.height}}>
            <div className='flex-grow'></div>
            <div onDoubleClick={handleDoubleClick} className='m-3 h-full w-full'>
                {isEditing ? (
                <div>
                    <textarea
                    value={currentText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    autoFocus
                    className='w-full h-full'
                    />
                </div>
                ) : (
                <HeaderText item={item} />
                )}
            <MoveComponent item={item} />
            </div>
            <div className='flex justify-between items-center p-2'>
            <ResizeComponent item={item} contentWidth={50} contentHeight={50} />
            </div>
            
        </div>
    );
};

export default EHeader;