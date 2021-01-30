import React from 'react';
import './Table.sass';

import {Avatar, Cell} from '@vkontakte/vkui';

interface TableRowProps
{
  title : string
  n ?: number
  description ?: string
  isHeader ?: boolean
  isDark ?: boolean
  colors : string[]
  values : string[]
  photo ?: string
  onClick ?: () => void
}

const TableRow : React.FC<TableRowProps> = ({
  n,
  isHeader,
  isDark,
  photo,
  colors,
  values,
  title,
  description,
  onClick,
}) => {
  return(
    <Cell
      style={{
        fontWeight: isHeader ? 'bold' : 'normal',
        background : isDark ? 'var(--background_keyboard)' : '',
        marginBottom : 4,
      }}
      before={photo &&
        <div className="photo">
          {n && <div className="photo__place">{n}</div>}
          <Avatar mode="image" src={photo}/>
        </div>
      }
      after={<div style={{padding:4,display:'flex',}}>
        {values.map((value, i) => {
          return <div
            key={i}
            style={{color:colors[i], marginRight:4, width:16, textAlign:'center'}}
          >{value}</div>
        })}
        </div>}
      disabled={!onClick}
      onClick={onClick}
      description={description}
    >{title}</Cell>
  )
}

export default TableRow