<script setup lang="ts">
import { computed, ref, reactive, toRaw, watch, watchEffect } from 'vue'
import { DataType } from '../api/port'
import { useController } from '../hooks/useController'

const controller = useController()
const dataList = controller.getAll()

const currentIndex = ref(0)
function onScroll(e: Event) {
	if (e.target instanceof HTMLDivElement) {
		const scrollTop = e.target.scrollTop
		currentIndex.value = Math.floor(scrollTop / 44)
	}
}

// 监听 currentIndex 和 dataList 变化，重新计算 renderList
const renderList = reactive<Array<DataType>>([])
watch(
	[currentIndex, () => dataList],
	() => {
		renderList.splice(0, renderList.length, ...dataList.slice(currentIndex.value, currentIndex.value + 11))
	},
	{ immediate: true, deep: true }
)

// 拖拽开始
function handleDragStart(e: DragEvent, id: string | undefined) {
	e.dataTransfer?.setData('text/plain', id ?? '')
}

// 拖拽交换位置
function handleDrop(e: DragEvent, id: string | undefined) {
	e.preventDefault()
	const result = e.dataTransfer?.getData('text/plain')
	const resultIndex = dataList.findIndex(item => item.id === result)
	const index = dataList.findIndex(item => item.id === id)
	const [delTemp] = dataList.splice(resultIndex, 1, dataList[index])
	dataList.splice(index, 1, delTemp)
	localStorage.setItem('dataList', JSON.stringify(toRaw(dataList)))
}
</script>

<template>
	<div class="table">
		<ul class="header">
			<li>标题</li>
			<li>日期</li>
			<li>操作</li>
		</ul>
		<div class="tbody" @scroll="onScroll">
			<div :style="{ height: dataList.length * 44 + 'px' }">
				<div :style="{ height: currentIndex * 44 + 'px' }"></div>
				<ul
					v-for="(value, index) in renderList"
					:key="value.id"
					draggable="true"
					@dragstart="handleDragStart($event, value.id)"
					@dragover="e => e.preventDefault()"
					@drop="handleDrop($event, value.id)"
				>
					<li>{{ value.title }}</li>
					<li>{{ value.date }}</li>
					<li class="operatePpanel">
						<slot :id="value.id"></slot>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.table {
	border: 1px solid #ffffff;
}

.tbody {
	height: calc(44 * 10px);
	overflow-y: scroll;
}

.header,
.tbody ul {
	box-sizing: border-box;
	height: 44px;
	display: flex;
	border-bottom: 1px solid #ffffff;
}

.header li,
.tbody ul li {
	padding: 10px 20px;
	width: 120px;
	text-align: center;
	border-right: 1px solid #ffffff;
}
.header li:last-child,
.tbody ul li:last-child {
	border-right: none;
}

.operatePpanel {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 7px;
}
</style>
