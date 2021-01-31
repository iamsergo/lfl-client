import React from 'react';
import './Prediction.sass';

import { Card, Div, Header, Spinner } from '@vkontakte/vkui';
import { PredictionInfo } from '../../types/PredictionInfo';
import { Icon12Verified } from '@vkontakte/icons';

interface PredictionProps
{
  title : string
  variants : string[]
  onPrediction : (variant : 0 | 1) => void
  loading : boolean
  predictionsInfo : PredictionInfo | null
  userPrediction : 0 | 1 | null
  canPredict : boolean
}

const Prediction : React.FC<PredictionProps> = ({
  title,
  variants,
  onPrediction,
  loading,
  predictionsInfo,
  userPrediction,
  canPredict,
}) => {
  const [activeVariant, setActiveVariant] = React.useState<0 | 1 | null>(userPrediction)
  const doPrediction = (predict : 0|1) => {
    if(loading || userPrediction !== null || !canPredict) return

    setActiveVariant(predict)
    onPrediction(predict)
  }

  return(
    <Div>
      <Card style={{display:'flex',flexDirection:'column'}}>
        <Header>{title}</Header>
        {loading
          ? <Div><Spinner/></Div>
          : <Div>
            {variants.map((variant,i) => {
              return <div
                key={i}
                className="prediction__btn"
                onClick={() => doPrediction(i as 0|1)}
                style={{background : (!canPredict || userPrediction !== null) ? 'rgba(0,0,0,0.3)' : ''}}
              >
                <div className="prediction__variant">
                  {variant}
                  {predictionsInfo && ` - ${i === 0 ? predictionsInfo.over : predictionsInfo.under}`}                  
                </div>
                {predictionsInfo &&
                  <div className="prediction__stat">
                    {(userPrediction==i || activeVariant === i) && <Icon12Verified/>}
                    {predictionsInfo.over + predictionsInfo.under === 0
                      ? 0
                      : (([predictionsInfo.over,predictionsInfo.under][i]/(predictionsInfo.over + predictionsInfo.under))*100).toFixed(0)
                    }%
                  </div>
                }
              </div>
            })}
          </Div>
        }

      </Card>
    </Div>
  )
}

export default Prediction