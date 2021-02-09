import React from 'react';
import './EventRow.sass'

interface EventRowProps
{
  isHome : boolean
  playerName : string
  eventType : string
  minute : number
}

const EventRow : React.FC<EventRowProps> = ({
  isHome,
  playerName,
  eventType,
  minute,
}) => {
  return(
    <div className="events__row">
      {playerName.includes('(аг)')
        ? <>
          <div className="events__player">{minute !== 0 && isHome ? minute : ''}{!isHome && playerName}</div>
          <div className="events__type">{eventType}</div>
          <div className="events__player">{isHome && playerName}{minute !== 0 && !isHome ? minute : ''}</div>
        </>
        : <>
          <div className="events__player">{minute !== 0 && !isHome ? minute : ''}{isHome && playerName}</div>
          <div className="events__type">{eventType}</div>
          <div className="events__player">{!isHome && playerName}{minute !== 0 && isHome ? minute : ''}</div>
        </>
      }
    </div>
  )
}

export default EventRow