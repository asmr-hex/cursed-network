import React, { useState } from 'react'

import { useWebSocket } from './context/ws'


export const Chat = props => {
  const { send } = useWebSocket()
  const [ msg, setMsg ] = useState('')
  
  // send message

  const onChange = e => setMsg(e.target.value)
  
  const onBlur = e => send(msg)
  
  return (
    <input type='text' placeholder='idk' value={msg} onBlur={onBlur} onChange={onChange}/>
  )
}
