import React, { ReactEventHandler } from 'react';

import bridge from '@vkontakte/vk-bridge'
import {CellButton, Card, Div} from '@vkontakte/vkui';
import {
  Icon20AddCircleFillBlue,
  Icon28FavoriteCircleFillYellow,
  Icon28HomeOutline,
  Icon28ReplyCircleFillGreen,
  Icon28UsersCircleFillGray
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

  const joinToGroup : ReactEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    e.preventDefault()
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
          before={<Icon28UsersCircleFillGray style={{marginRight:8}}/>}
          onClick={goToGroup}
          after={<Icon20AddCircleFillBlue onClick={joinToGroup}/>}
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