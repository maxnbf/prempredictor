import React from 'react';
import { Cell } from './style';

const PointCell = ({className, points}) => {
    return <Cell className={className}>{points>0 && '+'}{points}</Cell>
}

export default PointCell;