import { Request, Response } from 'express';
import { CustomError, GeneralFunctions } from '@/config';
import { UserService } from '@/services';
import { UserMapper } from '@/mappers';
import { UpdateUserDto } from '@/dtos';

export class UserController {
	constructor(private readonly userService: UserService) {}

	getAllUsers = async (
		_: Request,
		res: Response,
	): Promise<UserMapper[] | any> => {
		try {
			const [errorService, users] = await this.userService.getAllUsers();
			if (errorService) throw CustomError.badRequest(errorService);

			return res.status(201).json({
				message: 'Users retrieved successfully',
				users,
			});
		} catch (error) {
			if (error instanceof CustomError) {
				return res
					.status(error.statusCode)
					.json({ message: error.message });
			}
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	getUserByID = async (
		req: Request,
		res: Response,
	): Promise<UserMapper | any> => {
		try {
			const { id } = req.params;
			if (GeneralFunctions.isEmpty(id)) throw CustomError.badRequest('User ID is required');

			const [errorService, user] = await this.userService.getUserDataByID(id);
			if (errorService) throw CustomError.badRequest(errorService);

			return res.status(200).json({
				message: 'User retrieved successfully',
				user,
			});
		} catch (error) {
			if (error instanceof CustomError) {
				return res
					.status(error.statusCode)
					.json({ message: error.message });
			}
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	updateUserByID = async (
		req: Request,
		res: Response,
	): Promise<UserMapper | any> => {
		try {
			const { id } = req.params;
			if (GeneralFunctions.isEmpty(id)) throw CustomError.badRequest('User ID is required');

			const [errorDto, updateUserDto] = UpdateUserDto.create(req.body);
			if (errorDto) throw CustomError.badRequest(errorDto);

			const [errorService, user] = await this.userService.updateUserDataByID(id, updateUserDto!);
			if (errorService) throw CustomError.badRequest(errorService);

			return res.status(200).json({
				message: 'User updated successfully',
				user,
			});
		} catch (error) {
			if (error instanceof CustomError) {
				return res
					.status(error.statusCode)
					.json({ message: error.message });
			}
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	}
}
