/* eslint-disable */
import './styles.scss'

import { TiptapCollabProvider } from '@hocuspocus/provider'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {
  useCallback, useEffect,
  useState,
} from 'react'
import * as Y from 'yjs'
import * as signalR from '@microsoft/signalr'

import { variables } from '../../../variables.js'
import MenuBar from './MenuBar.jsx'
import { WebsocketProvider } from 'y-websocket'
import { WebsocketSignalProvider } from './websocket'

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D']
const names = [
  'Vitor',
  'Nils',
  'Ian',
  'Marcello',
  'Sebastian',
  'Marci',
  'Annalisa',
  'Santi',
  'Davide',
  'Andres',
  'Sam',
  'Lucas',
  'Leo',
  'Lean',
  'Marek',
  'Marion',
  'Mika',
]

const getRandomElement = list => list[Math.floor(Math.random() * list.length)]

const getRandomRoom = () => {
  const roomNumbers = variables.collabRooms?.trim()?.split(',') ?? [10, 11, 12]

  return getRandomElement(roomNumbers.map(number => `rooms.${number}`))
}
const getRandomColor = () => getRandomElement(colors)
const getRandomName = () => getRandomElement(names)

getRandomRoom()
// const room = getRandomRoom()
const room = 'test1234'

const ydoc = new Y.Doc()
// const websocketProvider = new TiptapCollabProvider({
//   appId: '7j9y6m10',
//   name: room,
//   document: ydoc,
// })
// const websocketProvider = new WebsocketProvider('ws://localhost:1234', room, ydoc, {
//   disableBc: true,
//   resyncInterval: -1,
// })
// const websocketProvider = new WebsocketProvider('ws://localhost:5000/collaboration', room, ydoc, {
//   disableBc: true,
//   resyncInterval: 5000,
// })

const getInitialUser = () => {
  // return JSON.parse(localStorage.getItem('currentUser')) || {
  //   name: getRandomName(),
  //   color: getRandomColor(),
  // }
  return {
    name: getRandomName(),
    color: getRandomColor(),
  }
}

const docName = 'test999'
// const signalrUrl = `http://localhost:5000/collab`
const signalrUrl = `https://api.cwork.io/api/v1/notifications/collab`
const websocketUrl = `ws://localhost:1234/`

const queryParams = {
  userId: '710fb749-ddcf-4117-b6c7-daca9356f3c8',
  workspaceId: '710fb749-ddcf-4117-b6c7-daca9356f3c8',
  docName: docName,
  clientId: ydoc.clientID
}

const queryParamsString = `userid=${queryParams.userId}&workspaceid=${queryParams.workspaceId}&docname=${queryParams.docName}&clientid=${queryParams.clientId}`;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${signalrUrl}?${queryParamsString}`, {
    // skipNegotiation: true,
    //transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Debug)
  .withAutomaticReconnect()
  .withStatefulReconnect()
  .build()

const connStart = connection.start()

const signalProvider = new WebsocketSignalProvider(
  websocketUrl,
  docName,
  ydoc,
  connection,
  {
    resyncInterval: 2500,
    disableBc: true
  }
)

export default () => {
  const [status, setStatus] = useState('connecting')
  const [currentUser, setCurrentUser] = useState(getInitialUser)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: signalProvider,
      }),
    ],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = document.getElementById('collab-iframe');
      iframe.src = iframe.src;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update status changes
    connStart.then(() => {
      setStatus('connected')
    })

    // websocketProvider.on('status', event => {
    //   setStatus(event.status)
    // })
  }, [])

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      editor.chain().focus().updateUser(currentUser).run()
    }
  }, [editor, currentUser])

  const setName = useCallback(() => {
    const name = (window.prompt('Name') || '').trim().substring(0, 32)

    if (name) {
      return setCurrentUser({ ...currentUser, name })
    }
  }, [currentUser])

  return (
    <div>
      <div className="editor">
        {editor && <MenuBar editor={editor}/>}
        <EditorContent className="editor__content" editor={editor}/>
        <div className="editor__footer">
          <div className={`editor__status editor__status--${status}`}>
            {status === 'connected'
              ? `${editor.storage.collaborationCursor.users.length} user${editor.storage.collaborationCursor.users.length === 1 ? '' : 's'} online in ${room}`
              : 'offline'}
            <br/>
            client ID {ydoc.clientID}
          </div>
          <div className="editor__name">
            <button onClick={setName}>{currentUser.name}</button>
          </div>
        </div>
      </div>
      <iframe src={`https://api.cwork.io/api/v1/notifications/collab`} style={{
        width: '100%',
        height: '750px'
      }}
              id={'collab-iframe'}
      >
      </iframe>
    </div>
)
}
