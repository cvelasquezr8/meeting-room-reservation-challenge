import { CustomError } from '@/config';
import { UpdateUserDto } from '@/dtos';
import { UserMapper } from '@/mappers';
import { User } from '@/models';

export class UserService {
	getUserByID(id: string): Promise<User | null> {
		return User.findByPk(id);
	}

	async getAllUsers(): Promise<[string?, UserMapper[]?]> {
		try {
			const users = await User.findAll();
			return [
				undefined,
				users.map((user) => UserMapper.fromObject(user)),
			];
		} catch (error) {
			return [
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [getAllUser]',
			];
		}
	}

	async getUserDataByID(id: string): Promise<[string?, UserMapper?]> {
		try {
			const user = await this.getUserByID(id);
			if (!user)
				throw CustomError.notFound('User not found with id ' + id);

			return [undefined, UserMapper.fromObject(user)];
		} catch (error) {
			return [
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [getUserById]',
			];
		}
	}

	async updateUserDataByID(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<[string?, UserMapper?]> {
		try {
			const user = await this.getUserByID(id);
			if (!user)
				throw CustomError.notFound(`User not found with id ${id}`);

			const [affectedCount] = await User.update(
				{ ...updateUserDto },
				{ where: { id } },
			);

			if (affectedCount === 0)
				throw CustomError.internalServerError(
					`User not updated with id ${id}`,
				);

			const updatedUser = await this.getUserByID(id);
			if (!updatedUser)
				throw CustomError.notFound(`User not found with id ${id}`);

			return [undefined, UserMapper.fromObject(updatedUser)];
		} catch (error) {
			return [
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [getUserById]',
			];
		}
	}
}
