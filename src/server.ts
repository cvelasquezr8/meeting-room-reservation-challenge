import app from './app';
import { envs } from '@/config/envs';
import { sequelize } from '@/data/sequelize.database';

const PORT = envs.port;

(async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		console.log('✅ Connected to PostgreSQL');

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (err) {
		console.error('❌ Unable to connect to DB:', err);
	}
})();
