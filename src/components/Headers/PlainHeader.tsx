import React from 'react';

import {Avatar, Div} from '@vkontakte/vkui';

interface PlainHeaderProps
{
  logo ?: string
  title : string
}

const PlainHeader : React.FC<PlainHeaderProps> = ({
  logo,
  title,
}) => {
  return(
    <Div style={{display:'flex'}}>
      {logo && <Avatar mode="image" size={96} src={logo}/>}
      <h4 style={{padding:12, margin:0}}>{title}</h4>
    </Div>
  )
}

export default PlainHeader