import {FC} from 'react';

interface Props {
    color?: string;
}

const Counter:FC<Props> = ({color} : Props) => {
    
    let style =  {
        height: '80%',
        width: '80%',
        margin: '10%',
        borderRadius: '50%',
        backgroundColor: color,
    }

    return (
        <div style={style}>
    
        </div>
    );
}

export { Counter };