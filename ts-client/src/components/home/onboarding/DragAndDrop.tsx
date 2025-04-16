import React from 'react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface DraggableTableProps {
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const DraggableRow: React.FC<{ item: string; index: number }> = ({
  item,
  index,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item });

  return (
    <TableRow
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <TableCell sx={{padding: .5, paddingLeft: 2}}>{index + 1}</TableCell>
      <TableCell sx={{padding: .5}}>{item}</TableCell>
    </TableRow>
  );
};

const DraggableTable: React.FC<DraggableTableProps> = ({ items, setItems }) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);

      const updatedItems = [...items];
      updatedItems.splice(oldIndex, 1);
      updatedItems.splice(newIndex, 0, active.id);
      setItems(updatedItems);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{padding: .5, paddingLeft: 2}}>Pos.</TableCell>
                <TableCell sx={{padding: .5}}>Team</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <DraggableRow key={item} item={item} index={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableTable;
