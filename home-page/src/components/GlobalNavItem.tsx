'use client';
import React, { forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import clsx from 'clsx';
import { Item } from '@/lib/widgets';

export const GlobalNavItem = forwardRef<HTMLDivElement, { item: Item }>(
  ({ item }, ref) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: item.name, // Type identifier for this draggable item
      item, // Data passed to the drop target
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    // Merge refs: Combine dragRef and forwarded ref
    const combinedRef = (node: HTMLDivElement | null) => {
      dragRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    return (
      <div
        ref={combinedRef} // Attach the combined ref
        className={clsx(
          'block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300',
          {
            'text-gray-400 hover:bg-gray-800': !isDragging,
            'text-white opacity-50': isDragging,
          },
        )}
      >
        {item.name}
      </div>
    );
  }
);

GlobalNavItem.displayName = 'GlobalNavItem';
