'use client';
import React, { useRef } from 'react';
import Canvas from '@/components/Canvas'
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {

  return ( 
    <DndProvider backend={HTML5Backend}>
    <div className='flex-1'>
      <Canvas isEditing={true}/>
    </div>
    </DndProvider>
  );
  }
