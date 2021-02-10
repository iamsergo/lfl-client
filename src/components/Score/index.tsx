import React from 'react';
import './Score.sass'

interface ScoreProps
{
  background : string
}

const Score : React.FC<ScoreProps> = ({
  background = '#76787a',
  children,
}) => {
  return(
    <div
      className="score"
      style={{background}}
    >{children}</div>
  )
}

export default Score