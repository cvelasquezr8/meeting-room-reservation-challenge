import { Request, Response, NextFunction } from 'express';
import { JwtAdapter, CustomError } from '@/config';

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Token missing or invalid' });
	}

	const token = authHeader.split(' ')[1];

	try {
		const payload = await JwtAdapter.validateToken(token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		(req as any).user = payload;

		next();
	} catch (error) {
		if (error instanceof CustomError) {
			return res
				.status(error.statusCode)
				.json({ message: error.message });
		}
		return res.status(401).json({ message: 'Unauthorized' });
	}
};
