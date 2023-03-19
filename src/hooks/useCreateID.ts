class CreateID {
	static instance: CreateID = new CreateID()
	private constructor() {}
	next() {
		return Date.now().toString() + Math.random().toString().slice(2)
	}
}

export function useCreateID() {
	return CreateID.instance
}
