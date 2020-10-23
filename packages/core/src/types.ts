import { Extension } from './Extension'
import { NodeExtension } from './NodeExtension'
import { MarkExtension } from './MarkExtension'

export type Extensions = (Extension | NodeExtension | MarkExtension)[]

export type Attribute = {
  default: any,
  rendered?: boolean,
  renderHTML?: (attributes: {
    [key: string]: any,
  }) => any,
  parseHTML?: () => any,
}

export type Attributes = {
  [key: string]: Attribute,
}

export type ExtensionAttribute = {
  type: string,
  name: string,
  attribute: Required<Attribute>,
}

export type GlobalAttributes = {
  types: string[],
  attributes: Attributes,
}[]

export type PickValue<T, K extends keyof T> = T[K]

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I)=>void)
  ? I
  : never

export type Diff<T extends keyof any, U extends keyof any> =
  ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]

export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;
