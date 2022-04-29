import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import logos from '../../../teamlogos/logodict';
import { Logo, Rank, TableRow } from './style';

const DragAndDropTable = ({teams, setTeams, favorite, setFavorite}) => {


    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(teams)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setTeams(items)
    }

    return <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='teams'>
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {teams.map((team, index) => 
                            <Draggable key={team} draggableId={team} index={index}>
                                {(provided) => (
                                    <TableRow {...provided.draggableProps} 
                                        {...provided.dragHandleProps} 
                                        ref={provided.innerRef} 
                                        onDoubleClick={() => setFavorite(team)}
                                        isFavorite={favorite === team}
                                    >
                                            <Rank className="table-rank">{index+1}.</Rank>
                                            <div>{team}</div>
                                            <Logo className="table-logo">{logos[team]}</Logo>
                                    </TableRow>
                                )}
                       
                            </Draggable>
                            )}
                            {provided.placeholder}
                        </ul>
                    )}
                
                </Droppable>
            </DragDropContext>
    

}


export default DragAndDropTable