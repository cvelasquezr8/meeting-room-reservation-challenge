export class UpdateUserDto {
	private constructor(public name: string) {}

	static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
		const { name } = object;
		if (!name) return ['Name is required'];
		return [undefined, new UpdateUserDto(name)];
	}
}
