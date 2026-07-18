import connectDatabase, {
  disconnectDatabase,
} from '../src/database/mongodb.js';

import logger from '../src/common/logger/logger.js';

import seedPermissions from '../src/seeders/permission.seeder.js';
import seedRoles from '../src/seeders/role.seeder.js';
import seedAdmin from '../src/seeders/admin.seeder.js';

const runSeeder = async () => {
  try {
    logger.info('====================================');
    logger.info('Starting Database Seeder...');
    logger.info('====================================');

    await connectDatabase();

    await seedPermissions();

    await seedRoles();

    await seedAdmin();

    logger.info('====================================');
    logger.info('Database Seeding Completed Successfully');
    logger.info('====================================');

    await disconnectDatabase();

    process.exit(0);
  } catch (error) {
    logger.error(error);

    await disconnectDatabase();

    process.exit(1);
  }
};

runSeeder();