import { Item } from "@/lib/widgets";

export const Section: React.FC<{ item: Item;  }> = ({ item}) => {
    return (
      <div
        className="absolute border-dotted border-2 border-gray-400"
        style={{
          width: 400, // Default width of the section
          height: 400, // Default height of the section
        }}
      >
        <h3 className="text-white">{item.name}</h3>
        <div className="text-white">{item.description}</div>
      </div>
    );
  };

  export default Section;