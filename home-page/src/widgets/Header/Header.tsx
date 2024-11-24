'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Item } from '@/lib/widgets';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import  EHeader from  './EHeader';
import { handleChangeComponent, handleIsEditing } from '@/context/WidgetContextFunctions';

export const Header: React.FC<{ item: Item }> = ({ item }) => {
    const dispatch = useContext(WidgetDispatchContext);
    

    const handleDoubleClick = () => {
        handleChangeComponent(dispatch, item.id, EHeader);
        handleIsEditing(dispatch, item.id, true);
    };

    return (
        <div className='absolute' style={{width: item.width, height: item.height}} onDoubleClick={handleDoubleClick}>
                <h1 className='break-words'
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                    }}>{item.name}</h1>
        </div>
    );
};

export default Header;