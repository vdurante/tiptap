import { createContext, useContext } from 'react'

export interface ReactNodeViewContextProps {
  onDragStart: (event: DragEvent) => void,
}

export const ReactNodeViewContext = createContext<Partial<ReactNodeViewContextProps>>({
  onDragStart: undefined,
})

export const useReactNodeView = () => useContext(ReactNodeViewContext)
