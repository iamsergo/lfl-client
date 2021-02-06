import React from 'react';

import {Avatar, Div, Link} from '@vkontakte/vkui';
import { Icon24Globe } from '@vkontakte/icons';

interface PlainHeaderProps
{
  logo ?: string
  title : string
  league ?: string
  city ?: string
  href ?: string
  hrefText ?: string
}

const PlainHeader : React.FC<PlainHeaderProps> = ({
  logo,
  title,
  city,
  href,
  hrefText,
}) => {
  return(
    <Div style={{display:'flex'}}>
      {logo && <Avatar mode="image" size={74} src={logo}/>}
      <div>
        <h3 style={{padding:0, margin:0, marginLeft: logo ? 8 : 0}}>{title}</h3>
        <h5 style={{padding:0, margin:0,marginTop:4,marginLeft: logo ? 8 : 0,color:'gray'}}>{city}</h5>
        {href && <Link style={{marginLeft:logo ? 8 : 0}} href={href}>{hrefText}</Link>}
      </div>
    </Div>
  )
}

export default PlainHeader