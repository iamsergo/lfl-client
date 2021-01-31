import React from 'react';
import './ListHeader.sass';

import { Icon28ChevronDownOutline } from '@vkontakte/icons';

interface ListHeaderProps
{
  collapsed : boolean
  onClick : () => void
}

const ListHeader : React.FC<ListHeaderProps> = ({
  collapsed,
  onClick,
  children,
}) => {
  return(
    <div
      className="list-header"
      onClick={onClick}
    >
      <div className="list-header__title">{children}</div>
      <Icon28ChevronDownOutline style={{transform : `rotate(${collapsed ? '0deg' : '180deg'})`}}/>
    </div>
  )
}

export default ListHeader