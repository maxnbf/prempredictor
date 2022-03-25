import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import logos from '../../teamlogos/logodict';
import watford from '../../teamlogos/watford.png'
const SetOrder = ({teams, setTeams, favorite, setFavorite}) => {


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
                                        className={favorite === team ? 'table-row make-ranking-favorite-team' : 'table-row'}
                                        onDoubleClick={() => setFavorite(team)}>
                                            <div className="table-rank">{index+1}.</div>
                                            <div>{team}</div>
                                            <div className="table-logo">{logos[team]}</div>
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