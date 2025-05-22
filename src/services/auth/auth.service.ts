import { BcryptAdapter, CustomError, JwtAdapter } from '@/config';
import { LoginUserDto, RegisterUserDto } from '@/dtos';
import { UserMapper } from '@/mappers';
import { User } from '@/models';

type LoginResponse = UserMapper & { token: string };
type HashFunction = (password: string) => string;
type ComparePassword = (password: string, hashed: string) => boolean;
type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class AuthService {
	constructor(
		private readonly hashFunction: HashFunction = BcryptAdapter.hash,
		private readonly comparePassword: ComparePassword = BcryptAdapter.compare,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	findUserByEmail(email: string): Promise<User | null> {
		return User.findOne({ where: { email } });
	}

	async registerUser(
		registerUserDto: RegisterUserDto,
	): Promise<[string?, UserMapper?]> {
		try {
			const { name, email, password } = registerUserDto;
			const userFound = await this.findUserByEmail(email);
			if (userFound) throw CustomError.badRequest('User already exists');

			const hashedPassword = await this.hashFunction(password);
			const user = await User.create({
				name,
				email,
				password: hashedPassword,
			});

			return [undefined, UserMapper.fromObject(user)];
		} catch (error) {
			return [
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [registerUser]',
			];
		}
	}

	async loginUser(
		loginUserDto: LoginUserDto,
	): Promise<[string?, LoginResponse?]> {
		try {
			const { email, password } = loginUserDto;
			const userFound = await this.findUserByEmail(email);
			if (!userFound) throw CustomError.badRequest('Invalid credentials');

			const isPasswordValid = await this.comparePassword(
				password,
				userFound.password,
			);

			if (!isPasswordValid)
				throw CustomError.badRequest('Invalid credentials');

			const token = await this.signToken({ id: userFound.id }, '2h');
			const userResponse = UserMapper.fromObject(userFound);

			return [
				undefined,
				{
					...userResponse,
					token: token || '',
				},
			];
		} catch (error) {
			return [
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [loginUser]',
			];
		}
	}
}
