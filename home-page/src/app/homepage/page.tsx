'use client'
import Canvas from "@/components/Canvas";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function HomePage() {

    return (
        <DndProvider backend={HTML5Backend}>
        <div className="w-full h-screen">
            <Canvas isEditing={false} />
        </div>
        </DndProvider>
    );
}