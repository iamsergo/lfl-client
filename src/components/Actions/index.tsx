import React from 'react';

import bridge from '@vkontakte/vk-bridge'
import {CellButton, Card, Div} from '@vkontakte/vkui';
import {
  Icon28AddCircleFillBlue,
  Icon28FavoriteCircleFillYellow,
  Icon28HomeOutline,
  Icon28ReplyCircleFillGreen,
  Icon28Users3Outline
} from '@vkontakte/icons';


interface ActionsProps
{
  openSnackbar : (msg : string) => void
}

const GROUP_ID = 202380422
const GROUP_HREF = `https://vk.com/club${GROUP_ID}`

const Actions: React.FC<ActionsProps> = ({
  openSnackbar,
}) => {

  const IS_ANDROID = window.location.href.includes('mobile_android')

  const addToFavourite = () => {
    bridge.send('VKWebAppAddToFavorites')
      .then(_=>openSnackbar('Успешно добавлено !'))
      .catch(err=>err)
  }

  const joinToGroup = () => {
    bridge.send('VKWebAppJoinGroup',{group_id:GROUP_ID})
      .then(_=>openSnackbar('Вы вступили. Спасибо!'))
      .catch(err=>err)
  }

  const goToGroup = () => {
    let a = document.createElement('a')
    a.href = GROUP_HREF
    a.target = '_blank'
    a.click()
    a.remove()
  }

  const share = () => {
    bridge.send('VKWebAppShare')
      .then(res=>res)
      .catch(err=>err)
  }

  const addToHomeScreen = () => {
    bridge.send('VKWebAppAddToHomeScreen')
      .then(_=>openSnackbar('Успешно добавлено !'))
      .catch(err=>err)
  }

  return(
    <Div>
      <Card>
        <CellButton
          before={<Icon28Users3Outline style={{marginRight:8}}/>}
          onClick={goToGroup}
        >Группа приложения</CellButton>
        <CellButton
          before={<Icon28FavoriteCircleFillYellow style={{marginRight:8}}/>}
          onClick={addToFavourite}
        >Добавить в избранное</CellButton>
        <CellButton
          before={<Icon28ReplyCircleFillGreen style={{marginRight:8}}/>}
          onClick={share}
        >Поделиться</CellButton>
        {IS_ANDROID &&
          <CellButton
            onClick={addToHomeScreen}
            before={<Icon28HomeOutline style={{marginRight:8}}/>}
          >На дом. экран</CellButton>
        }
      </Card>
    </Div>
  )
}

export default Actions