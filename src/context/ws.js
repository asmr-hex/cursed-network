import React, { createContext, useContext, useEffect, useRef } from 'react'


const WebSocketContext = createContext()

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext)
  if (ctx === undefined) {
    throw new Error(`useWebSocket must be called within a WebSocketProvider`)
  }
  return ctx
}

export const WebSocketProvider = props => {
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:3001`)
    ws.current.onopen = () => console.log(`ws open`)
    ws.current.onclose = () => console.log(`ws closed`)
    ws.current.onmessage = msg => alert(msg)

    return () => ws.current.close()
  }, [])

  const send = msg => {
    if (ws.current === null) {
      console.log("message could not be sent")
      return
    }
    
    ws.current.send(msg)
  }
  
  return (
    <WebSocketContext.Provider value={{ send }}>
      { props.children }
    </WebSocketContext.Provider>
  )
}
