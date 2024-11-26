'use client';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { WidgetContext } from '@/context/WidgetContext';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import { handleLoad } from '@/context/WidgetContextFunctions';

interface SavedLayoutProps {
    editing: boolean;
}

const SavedLayout: React.FC<SavedLayoutProps> = ({ editing }) => {
    const dispatch = useContext(WidgetDispatchContext);

    useEffect(() => {
        handleLoad(dispatch);
    }, []);
    const widgets = useContext(WidgetContext);

    if(!editing){
    widgets.map((widget) => {
        widget.editComponent = null;
        widget.toolBar = null;
    });
    return (
        <div>
            {widgets.map((widget) => (
                
                <div key={widget.id}>
                    <div
                        className="absolute h-screen flex flex-col overflow-hidden border border-white"
                        style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}
                    >
                        <div className="" style={{ width: widget.width, height: widget.height }}>
                            <div>
                                <widget.component item={widget} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    }
};

export default SavedLayout;