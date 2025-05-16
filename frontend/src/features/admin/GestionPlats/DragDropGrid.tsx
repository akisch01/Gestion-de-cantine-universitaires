import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "react-beautiful-dnd";
import { Plat } from "../../../types/models";

interface DragDropGridProps {
  plats: Plat[];
  onReorder: (plats: Plat[]) => void;
}

export const DragDropGrid: React.FC<DragDropGridProps> = ({ plats, onReorder }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(plats);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="plats">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {plats.map((plat, index) => (
              <Draggable key={plat.id} draggableId={plat.id.toString()} index={index}>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <img
                      src={plat.image}
                      alt={plat.nom_plat}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {plat.nom_plat}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {plat.prix.toFixed(2)} €
                    </p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};