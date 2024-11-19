'use client';
import { useDrag } from 'react-dnd';
import { useRef, useEffect } from 'react';
import { Item } from '@/lib/widgets';

export const Header: React.FC<{ item: Item }> = ({ item }) => {    
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag(() => ({
      type: item.name,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    useEffect(() => {
      if (ref.current) {
        drag(ref.current);
      }
    }, [ref, drag]);
  
    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <h3 className='text-black'>{item.name}</h3>
        <p className='text-black'>{item.description}</p>
      </div>
    );
  }
  
  export default Header;