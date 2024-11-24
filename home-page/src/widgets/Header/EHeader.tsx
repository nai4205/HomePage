'use client';
import React, { useState, useContext, useEffect, use } from 'react';
import { Item } from '@/lib/widgets';
import { WidgetDispatchContext, WidgetContext } from '@/context/WidgetContext';
import { handleChangeComponent } from '@/context/WidgetContextFunctions';
import { handleRemoveById, handleWidgetResize, handleIsEditing } from '@/context/WidgetContextFunctions';
import { Header } from '@/widgets/Header/Header';
import ResizeComponent from '@/utils/resize';
import MoveComponent from '@/utils/move';
import { OptionsContext } from '@/context/OptionsContext';

export const EHeader: React.FC<{ item: Item }> = ({ item }) => {

    console.log(item);
    if (!item) return null;

    
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(item.name);
    const dispatch = useContext(WidgetDispatchContext);
    const options = useContext(OptionsContext);
    
    
    const ref = React.useRef<HTMLDivElement>(null);
    const toolBarRef = React.useRef<{ [key: number]: HTMLDivElement | null }>({});

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
        <div className='flex md:flex md:flex-grow flex-col static' style={{width: item.width, height: item.height}}>
        <div className='' ref={(el) => { toolBarRef.current[item.id] = el }} >
            <div style={{ border: '2px solid #4CAF50' }} className='w-full'>
            {item.toolBar && <item.toolBar item={item} />} 
            </div>
        </div>
            
                        
                        {/* <div
                            style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '10px',
                            height: '10px',
                            cursor: 'se-resize',
                            backgroundColor: 'gray',
                            }}
                            onMouseDown={(e) =>
                            onMoveStart(e, item.id) // Start resizing the specific widget
                            }
                        /> */}
                        
            <div onDoubleClick={handleDoubleClick} className='m-3 flex-grow'>
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
                    <h1
                    ref={ref}
                    className='break-words'
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                    }}
                  >
                    {item.name}
                  </h1>
                )}
                
            </div>
            <ResizeComponent item={item} contentWidth={50} contentHeight={50} />
            <MoveComponent item={item} />
        </div>
    );
};

export default EHeader;