import { TrashIcon, CheckIcon } from '@heroicons/react/24/solid';
import { handleIsEditing, handleRemoveById, handleChangeComponent } from '@/context/WidgetContextFunctions';
import { WidgetDispatchContext } from '@/context/WidgetContext';
import { useContext } from 'react';
import { Header } from '@/widgets/Header/Header';
import { Item } from '@/lib/widgets';

export const HeaderToolBar: React.FC<{ item: Item }> = ({ item }) => {
    const dispatch = useContext(WidgetDispatchContext);

    const handleDelete = () => {
        handleRemoveById(dispatch, item.id);
    };

    const handleApply = () => {
        handleIsEditing(dispatch, item.id, false);
        handleChangeComponent(dispatch, item.id, Header);
    };

    return (
            <div className='flex justify-between items-center bg-gray-800 p-2 m-2 border-2 w-full h-fit'>
            <div className='flex w-full justify-around'>
                <button onClick={handleDelete} className='text-red-500'><TrashIcon className="block w-6 text-gray-400"/>
                </button>
                <button onClick={handleApply} className='p-2 bg-blue-500 text-white'><CheckIcon className='block w-6 text-gray-400'/></button>
            </div>
            </div>
    );
}