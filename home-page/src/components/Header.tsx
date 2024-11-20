'use client';
import { Item } from '@/lib/widgets';

export const Header: React.FC<{ item: Item }> = ({ item }) => {    
    return (
      <div>
        <h3 className='text-black'>{item.name}</h3>
        <p className='text-black'>{item.description}</p>
      </div>
    );
  }
  
  export default Header;