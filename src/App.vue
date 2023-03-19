<script setup lang="ts">
import Table from './components/Table.vue'
import { useController } from './hooks/useController'
import { nextTick, onMounted, ref, reactive } from 'vue'
import { DataType } from './api/port'
import { isString, validate } from './utils'

const controller = useController()
const formRef = ref<HTMLFormElement>()
const textRef = ref<HTMLInputElement>()
const dataList = controller.getAll()
let formData = reactive<DataType>({
	id: '',
	title: '',
	date: ''
})

// 处理提交
async function handleSubmit() {
	try {
		await validate({ ...formData, id: '-1' })
		if (isString(formData.id)) {
			controller.update(formData.id, { ...formData })
		} else {
			controller.add({ ...formData })
		}
	} catch (error) {
		alert(error)
	} finally {
		formData = Object.assign(formData, { id: '', title: '', date: '' })
	}
}

// 处理编辑
async function handleEdit(id: string | undefined) {
	if (!isString(id)) return
	const result = controller.get(id)
	formData = Object.assign(formData, result)
	await nextTick()
	textRef.value?.focus()
}

// 处理删除
function handleDele(id: string | undefined) {
	if (isString(id)) controller.del(id)
}

// 生成测试数据
function addTestData() {
	const title = String.fromCharCode(Math.floor(Math.random() * 26) + 65) + Date.now().toString().slice(-3)
	const date = new Date().toISOString().slice(0, 10)
	controller.add({ title, date })
}
</script>

<template>
	<div class="box">
		<div class="editPreview">
			{{ isString(formData.id) ? '编辑：' + formData.title : '添加：' }}
		</div>
		<div class="formBox">
			<form ref="formRef">
				<div>
					<label for="text">标题：</label>
					<input
						type="search"
						id="text"
						placeholder="请输入代办标题"
						v-model="formData.title"
						ref="textRef"
					/>
				</div>
				<div>
					<label for="date">日期：</label>
					<input type="date" id="date" v-model="formData.date" />
				</div>
			</form>
		</div>
		<div class="controlBox">
			<input type="button" value="提交" @click="handleSubmit" />
			<input type="button" value="添加测试数据" @click="addTestData" />
		</div>
		<div>
			<Table>
				<template #default="{ id }">
					<input type="button" value="编辑" @click="handleEdit(id)" />
					<input type="button" value="删除" @click="handleDele(id)" />
				</template>
			</Table>
		</div>
	</div>
</template>

<style scoped>
.box {
	padding: 20px;
	width: 500px;
	height: 650px;
	border: 1px solid #dddddd;
}

.box > div {
	margin-bottom: 30px;
	display: flex;
}

.formBox form {
	display: flex;
	gap: 30px;
}

.controlBox {
	gap: 30px;
}

.editPreview {
	padding-bottom: 10px;
	border-bottom: 1px solid #ffffff;
}
</style>

