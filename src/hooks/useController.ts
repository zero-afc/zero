import { Control, DataType, ConstructorType, ConstructorParam } from '../api/port'
import { useCreateID } from './useCreateID'
import { reactive, watch } from 'vue'

// 装饰器 >>> 用于把最新存储数据到localStorage中
function dataStorage(target: any, key: string, descriptor: PropertyDescriptor) {
	const method = descriptor.value
	descriptor.value = function (...args: any[]) {
		const result = method.apply(this, args)
		localStorage.setItem('dataList', JSON.stringify((this as typeof target).dataList))
		return result
	}
}

// 控制器 >>> 操作数据
class Controller<T extends DataType> implements Control<T> {
	private createID = useCreateID() // 用于生成id
	dataList: Array<T> // 用于存储数据

	// 构造函数
	constructor(dataList?: Array<T>) {
		const data = localStorage.getItem('dataList')
		if (data) {
			this.dataList = reactive(JSON.parse(data)) as Array<T>
			return
		}
		this.dataList = reactive(dataList || []) as Array<T>
	}

	// 添加数据
	@dataStorage
	add(value: T) {
		const id = this.createID.next()
		this.dataList.push({ ...value, id })
	}

	// 删除数据
	@dataStorage
	del(id: string) {
		const index = this.dataList.findIndex(item => item.id === id)
		this.dataList.splice(index, 1)
	}

	// 更新数据
	@dataStorage
	update(id: string, value: T) {
		const result = this.dataList.find(item => item.id === id)
		if (result) Object.assign(result, value)
	}

	// 获取数据
	get(id: string) {
		return this.dataList.find(item => item.id === id)
	}

	// 获取所有数据
	getAll() {
		return this.dataList
	}
}

// 代理类 >>> 单例模式
class ProxyController {
	private static instance: Control

	private constructor() {}

	static getInstance<T extends Control, P extends ConstructorType<T>>(
		c: ConstructorType<T>,
		...args: ConstructorParam<P>
	) {
		if (!this.instance) {
			this.instance = new c(...args)
		}
		return this.instance
	}
}

export function useController(list?: Array<DataType>) {
	return ProxyController.getInstance<Controller<DataType>, typeof Controller>(Controller, list)
}
