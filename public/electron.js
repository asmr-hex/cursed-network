const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const net = require('net')
const fs  = require('fs')
const WebSocket = require('ws')


const SOCKETFILE = './.socket'

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1000, height: 600});
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


////////////////////////
//                    //
// UNIX SOCKET CLIENT //
//                    //
////////////////////////


// create unix socket client (for connecting to backend)
const unixSocketClient = net.Socket()

const connectUnixSocket = () => {
  console.log(`connecting to ${SOCKETFILE}`)
  unixSocketClient.connect(SOCKETFILE) 
}

let unixSocketRetryFn = null
const launchUnixSocketRetry = () => {
  if (unixSocketRetryFn) return
  unixSocketRetryFn = setInterval(connectUnixSocket, 500)
}
const clearUnixSocketRetry = () => {
  if (!unixSocketRetryFn) return
  clearInterval(unixSocketRetryFn)
  unixSocketRetryFn = null
}

unixSocketClient.on('connect', () => {
  clearUnixSocketRetry()
  console.log('connected')
})

unixSocketClient.on('data', data => {
  console.log(data.toString())
})

unixSocketClient.on('error', data => {
  console.error('yikes')
  console.error(data.toString())
})

unixSocketClient.on('close', () => {
  console.error("connection closed")
  launchUnixSocketRetry()
})

unixSocketClient.on('end', () => {
  console.error("connection ended")
  launchUnixSocketRetry()
})

connectUnixSocket()

////////////////////////////
//                        //
// WEBSOCKET RELAY SERVER //
//                        //
////////////////////////////


// create websocket server
const wss = new WebSocket.Server({ port: 3001 })

wss.on('connection', ws => {
  ws.on('message', data => {
    // forward ws messages to server via unix socket
    unixSocketClient.write(data)
  })

  console.log("YAY")
})


