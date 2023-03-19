export function isString(value: any): value is string {
	return value && typeof value === 'string'
}

// 表单验证
export function validate(formData: object) {
	return new Promise((resolve, reject) => {
		Object.values(formData).some(item => !item) ? reject('表单验证失败') : resolve('ok')
	})
}
