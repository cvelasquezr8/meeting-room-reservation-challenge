import { CustomError } from '@/config';

export class UserMapper {
	private constructor(
		public id: string,
		public name: string,
		public email: string,
		public createdAt: Date,
		public updatedAt: Date,
	) {}

	static fromObject(object: { [key: string]: any }): UserMapper {
		const { id, name, password, email, createdAt, updatedAt } = object;
		if (!id) throw CustomError.badRequest('User ID is required');
		if (!name) throw CustomError.badRequest('Name is required');
		if (!email) throw CustomError.badRequest('Email is required');
		if (!password) throw CustomError.badRequest('Password is required');
		return new UserMapper(id, name, email, createdAt, updatedAt);
	}
}
