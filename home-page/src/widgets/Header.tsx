'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Item } from '@/lib/widgets';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import  EHeader from  './edit/EHeader';
import { handleChangeComponent } from '@/context/WidgetContextFunctions';

export const Header: React.FC<{ item: Item }> = ({ item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(item.name);
    const dispatch = useContext(WidgetDispatchContext);
    

    const handleDoubleClick = () => {
        handleChangeComponent(dispatch, item.id, EHeader);
        setIsEditing(true);
    };

    return (
        <div className='p-3 flex-1 w-fit h-fit' onDoubleClick={handleDoubleClick}>
                <h1 className='text-white'>{item.name}</h1>
        </div>
    );
};

export default Header;