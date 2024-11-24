import { Item } from "@/lib/widgets";
export const HeaderText: React.FC<{ item: Item }> = ({ item }) => {
    return (
    <h1 className='break-words text-white'
    style={{
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
    }}>{item.name}</h1>
    );
}