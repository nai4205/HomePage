'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Item } from '@/lib/widgets';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import  EHeader from  './EHeader';
import { handleChangeComponent, handleIsEditing } from '@/context/WidgetContextFunctions';
import { HeaderText } from './HeaderText';

export const Header: React.FC<{ item: Item }> = ({ item }) => {
    const dispatch = useContext(WidgetDispatchContext);
    

    const handleDoubleClick = () => {
        if(item.editComponent){
        handleChangeComponent(dispatch, item.id, EHeader);
        handleIsEditing(dispatch, item.id, true);
        }
    };

    return (
        <div className='absolute' style={{width: item.width, height: item.height}} onDoubleClick={handleDoubleClick}>
            <HeaderText item={item}/>
        </div>
    );
};

export default Header;