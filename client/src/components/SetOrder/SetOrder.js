import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const SetOrder = ({teams, setTeams}) => {


    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(teams)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setTeams(items)
    }

    return <div className="table">
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='teams'>
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {teams.map((team, index) => 
                            <Draggable key={team} draggableId={team} index={index}>
                                {(provided) => (
                                    <li {...provided.draggableProps} 
                                        {...provided.dragHandleProps} 
                                        ref={provided.innerRef} 
                                        className="table-row">
                                        <div className="table-rank">{index+1}.</div>
                                        <div>{team}</div>
                                        <div className="table-logo">logo</div>
                                    </li>
                                )}
                       
                            </Draggable>
                            )}
                            {provided.placeholder}
                        </ul>
                    )}
                
                </Droppable>
            </DragDropContext>
        </div>

}


export default SetOrder