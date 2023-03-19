export type DataType = {
	id?: string
	title: string
	date: string
}

export interface Control<T = DataType> {
	add: (value: T) => void
	del: (id: string) => void
	update: (id: string, value: T) => void
	get: (id: string) => T | undefined
	getAll: () => Array<T>
}

export type ConstructorType<T> = new (...args: any[]) => T
export type ConstructorParam<T extends ConstructorType<any>> = T extends new (...args: infer P) => any
	? P
	: never
