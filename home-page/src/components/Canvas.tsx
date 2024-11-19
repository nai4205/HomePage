'use client';
import React, { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { widgets, type Item } from '@/lib/widgets';

export default function Page() {
  const [canvasWidgets, setCanvasWidgets] = useState<
    { widget: Item; x: number; y: number }[]
  >([]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: widgets.flatMap((section) => section.items.map((item) => item.name)),
    drop: (item: Item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        setCanvasWidgets((prev) => [
          ...prev,
          { widget: item, x: offset.x, y: offset.y },
        ]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={(element) => {
          if (element) {
            dropRef(element); // Connect react-dnd's ref to this element
          }
        }}
        className="relative w-full h-screen bg-gray-900"
        style={{ border: isOver ? '2px dashed white' : '2px solid transparent' }}
      >
        {canvasWidgets.map(({ widget, x, y }, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: x, top: y }}
          >
            {widget.component ? (
              <widget.component item={widget} />
            ) : (
              <div className="text-white">{widget.name}</div>
            )}
          </div>
        ))}
      </div>
    </DndProvider>
  );
}
