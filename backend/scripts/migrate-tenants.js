import mongoose from 'mongoose';

import env from '../src/config/env.js';

const DRY_RUN = process.argv.includes('--dry-run');

const log = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.log(`[WARN] ${msg}`),
  error: (msg) => console.log(`[ERROR] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`),
};

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    log.info(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    log.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    log.info('MongoDB Connection Closed');
  } catch (error) {
    log.error(`Error closing MongoDB connection: ${error.message}`);
  }
};

const runMigration = async () => {
  if (DRY_RUN) {
    log.info('Running in DRY-RUN mode. No changes will be written.');
  }

  await connectDatabase();

  const db = mongoose.connection.db;

  const workersCollection = db.collection('workers');
  const usersCollection = db.collection('users');
  const sitesCollection = db.collection('sites');
  const attendancesCollection = db.collection('attendances');
  const payrollsCollection = db.collection('payrolls');
  const paymentsCollection = db.collection('payments');
  const notificationsCollection = db.collection('notifications');
  const tenantsCollection = db.collection('tenants');

  const stats = {
    contractorUsersFound: 0,
    tenantsCreated: 0,
    usersUpdated: 0,
    workersUpdated: 0,
    sitesUpdated: 0,
    attendancesUpdated: 0,
    payrollsUpdated: 0,
    paymentsUpdated: 0,
    notificationsUpdated: 0,
    missingContractors: 0,
    missingUserTenants: 0,
    missingWorkerTenants: 0,
    missingSiteTenants: 0,
    missingAttendanceTenants: 0,
    missingPayrollTenants: 0,
    missingPaymentTenants: 0,
    missingNotificationTenants: 0,
  };

  try {
    log.info('====================================');
    log.info('Starting Tenant Migration');
    log.info('====================================');

    const distinctContractors = await workersCollection
      .find({ isDeleted: false, contractor: { $ne: null } })
      .distinct('contractor');

    log.info(`Found ${distinctContractors.length} distinct contractor users`);

    if (distinctContractors.length === 0) {
      log.warn('No contractor users found. Nothing to migrate.');
      await disconnectDatabase();
      process.exit(0);
    }

    const contractorUsers = await usersCollection
      .find({ _id: { $in: distinctContractors } })
      .toArray();

    stats.contractorUsersFound = contractorUsers.length;

    const contractorMap = new Map();
    for (const user of contractorUsers) {
      contractorMap.set(user._id.toString(), user);
    }

    const missingContractorIds = distinctContractors.filter(
      (id) => !contractorMap.has(id.toString())
    );
    stats.missingContractors = missingContractorIds.length;

    if (missingContractorIds.length > 0) {
      log.warn(
        `${missingContractorIds.length} contractor users not found in User collection:`
      );
      missingContractorIds.forEach((id) => log.warn(`  - ${id}`));
    }

    log.info('====================================');
    log.info('Inspecting existing data for duplicates');
    log.info('====================================');

    const duplicateChecks = [
      {
        name: 'Worker employeeCode',
        collection: workersCollection,
        groupKey: ['tenant', 'employeeCode'],
      },
      {
        name: 'Worker mobileNumber',
        collection: workersCollection,
        groupKey: ['tenant', 'mobileNumber'],
      },
      {
        name: 'Worker aadhaarNumber',
        collection: workersCollection,
        groupKey: ['tenant', 'aadhaarNumber'],
      },
      {
        name: 'Worker panNumber',
        collection: workersCollection,
        groupKey: ['tenant', 'panNumber'],
      },
      {
        name: 'Site siteCode',
        collection: sitesCollection,
        groupKey: ['tenant', 'siteCode'],
      },
    ];

    let hasDuplicates = false;

    for (const check of duplicateChecks) {
      const groupStage = {};
      for (const key of check.groupKey) {
        groupStage[key] = `$${key}`;
      }

      const duplicates = await check.collection
        .aggregate([
          {
            $match: { isDeleted: false },
          },
          {
            $group: {
              _id: groupStage,
              count: { $sum: 1 },
              ids: { $push: '$_id' },
            },
          },
          {
            $match: { count: { $gt: 1 } },
          },
        ])
        .toArray();

      if (duplicates.length > 0) {
        hasDuplicates = true;
        log.warn(`Duplicate ${check.name} entries found:`);
        duplicates.forEach((dup) => {
          log.warn(`  Key: ${JSON.stringify(dup._id)} (count: ${dup.count})`);
        });
      } else {
        log.info(`No duplicate ${check.name} entries found.`);
      }
    }

    if (hasDuplicates) {
      log.error(
        'DUPLICATE DATA DETECTED. Resolve duplicates before applying new unique indexes. Aborting migration.'
      );
      await disconnectDatabase();
      process.exit(1);
    }

    log.info('Duplicate check passed. Proceeding with migration...');

    for (const user of contractorUsers) {
      const tenantData = {
        companyName: `${user.fullName} Tenant`,
        owner: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
        address: null,
        city: null,
        district: null,
        state: null,
        pincode: null,
        status: 'ACTIVE',
        createdBy: user._id,
        updatedBy: user._id,
        isDeleted: false,
        deletedAt: null,
      };

      if (!DRY_RUN) {
        const existingTenant = await tenantsCollection.findOne({
          owner: user._id,
        });

        if (existingTenant) {
          log.info(`Tenant already exists for user ${user._id}`);
          user._tenantId = existingTenant._id;
        } else {
          const result = await tenantsCollection.insertOne(tenantData);
          stats.tenantsCreated++;
          log.info(`Created tenant for user ${user._id}`);
          user._tenantId = result.insertedId;
        }
      } else {
        const existingTenant = await tenantsCollection.findOne({
          owner: user._id,
        });
        user._tenantId = existingTenant ? existingTenant._id : 'dry-run-tenant-id';
        log.info(`[DRY-RUN] Would create/use tenant for user ${user._id}`);
      }

      const userUpdate = { $set: { tenant: user._tenantId } };
      if (!DRY_RUN) {
        await usersCollection.updateOne({ _id: user._id }, userUpdate);
        stats.usersUpdated++;
      } else {
        log.info(`[DRY-RUN] Would update User.tenant for ${user._id}`);
      }
    }

    log.info('====================================');
    log.info('Updating Worker.tenant');
    log.info('====================================');

    const workersWithoutTenant = await workersCollection
      .find({ isDeleted: false, contractor: { $ne: null }, tenant: { $ne: null } })
      .countDocuments();

    log.info(`Workers already having tenant: ${workersWithoutTenant}`);

    const workersToUpdate = await workersCollection
      .find({ isDeleted: false, contractor: { $ne: null } })
      .toArray();

    log.info(`Workers to update: ${workersToUpdate.length}`);

    for (const worker of workersToUpdate) {
      const contractorId = worker.contractor?.toString();
      const contractorUser = contractorMap.get(contractorId);

      if (!contractorUser || !contractorUser._tenantId) {
        stats.missingWorkerTenants++;
        log.warn(
          `Worker ${worker._id} has contractor ${contractorId} but no tenant mapping`
        );
        continue;
      }

      if (!DRY_RUN) {
        await workersCollection.updateOne(
          { _id: worker._id },
          { $set: { tenant: contractorUser._tenantId } }
        );
        stats.workersUpdated++;
      } else {
        log.info(
          `[DRY-RUN] Would set Worker.tenant=${contractorUser._tenantId} for worker ${worker._id}`
        );
      }
    }

    log.info('====================================');
    log.info('Updating Site.tenant');
    log.info('====================================');

    const sitesToUpdate = await sitesCollection
      .find({ isDeleted: false, createdBy: { $ne: null } })
      .toArray();

    log.info(`Sites to update: ${sitesToUpdate.length}`);

    for (const site of sitesToUpdate) {
      const createdByUserId = site.createdBy?.toString();
      const user = contractorMap.get(createdByUserId);

      if (!user || !user._tenantId) {
        stats.missingSiteTenants++;
        log.warn(
          `Site ${site._id} createdBy ${createdByUserId} has no tenant mapping`
        );
        continue;
      }

      if (!DRY_RUN) {
        await sitesCollection.updateOne(
          { _id: site._id },
          { $set: { tenant: user._tenantId } }
        );
        stats.sitesUpdated++;
      } else {
        log.info(
          `[DRY-RUN] Would set Site.tenant=${user._tenantId} for site ${site._id}`
        );
      }
    }

    log.info('====================================');
    log.info('Updating Attendance.tenant');
    log.info('====================================');

    const attendancesToUpdate = await attendancesCollection
      .find({ isDeleted: false })
      .toArray();

    log.info(`Attendance records to update: ${attendancesToUpdate.length}`);

    for (const attendance of attendancesToUpdate) {
      const workerId = attendance.worker?.toString();
      const worker = await workersCollection.findOne({ _id: workerId });

      if (!worker || !worker.contractor) {
        stats.missingAttendanceTenants++;
        log.warn(
          `Attendance ${attendance._id} worker ${workerId} has no contractor`
        );
        continue;
      }

      const contractorUser = contractorMap.get(worker.contractor.toString());
      if (!contractorUser || !contractorUser._tenantId) {
        stats.missingAttendanceTenants++;
        log.warn(
          `Attendance ${attendance._id} worker contractor has no tenant mapping`
        );
        continue;
      }

      if (!DRY_RUN) {
        await attendancesCollection.updateOne(
          { _id: attendance._id },
          { $set: { tenant: contractorUser._tenantId } }
        );
        stats.attendancesUpdated++;
      } else {
        log.info(
          `[DRY-RUN] Would set Attendance.tenant=${contractorUser._tenantId} for attendance ${attendance._id}`
        );
      }
    }

    log.info('====================================');
    log.info('Updating Payroll.tenant');
    log.info('====================================');

    const payrollsToUpdate = await payrollsCollection
      .find({ isDeleted: false })
      .toArray();

    log.info(`Payroll records to update: ${payrollsToUpdate.length}`);

    for (const payroll of payrollsToUpdate) {
      const workerId = payroll.worker?.toString();
      const worker = await workersCollection.findOne({ _id: workerId });

      if (!worker || !worker.contractor) {
        stats.missingPayrollTenants++;
        log.warn(
          `Payroll ${payroll._id} worker ${workerId} has no contractor`
        );
        continue;
      }

      const contractorUser = contractorMap.get(worker.contractor.toString());
      if (!contractorUser || !contractorUser._tenantId) {
        stats.missingPayrollTenants++;
        log.warn(
          `Payroll ${payroll._id} worker contractor has no tenant mapping`
        );
        continue;
      }

      if (!DRY_RUN) {
        await payrollsCollection.updateOne(
          { _id: payroll._id },
          { $set: { tenant: contractorUser._tenantId } }
        );
        stats.payrollsUpdated++;
      } else {
        log.info(
          `[DRY-RUN] Would set Payroll.tenant=${contractorUser._tenantId} for payroll ${payroll._id}`
        );
      }
    }

    log.info('====================================');
    log.info('Updating Payment.tenant');
    log.info('====================================');

    const paymentsToUpdate = await paymentsCollection
      .find({ isDeleted: false })
      .toArray();

    log.info(`Payment records to update: ${paymentsToUpdate.length}`);

    for (const payment of paymentsToUpdate) {
      const workerId = payment.worker?.toString();
      const worker = await workersCollection.findOne({ _id: workerId });

      if (!worker || !worker.contractor) {
        stats.missingPaymentTenants++;
        log.warn(
          `Payment ${payment._id} worker ${workerId} has no contractor`
        );
        continue;
      }

      const contractorUser = contractorMap.get(worker.contractor.toString());
      if (!contractorUser || !contractorUser._tenantId) {
        stats.missingPaymentTenants++;
        log.warn(
          `Payment ${payment._id} worker contractor has no tenant mapping`
        );
        continue;
      }

      if (!DRY_RUN) {
        await paymentsCollection.updateOne(
          { _id: payment._id },
          { $set: { tenant: contractorUser._tenantId } }
        );
        stats.paymentsUpdated++;
      } else {
        log.info(
          `[DRY-RUN] Would set Payment.tenant=${contractorUser._tenantId} for payment ${payment._id}`
        );
      }
    }

    log.info('====================================');
    log.info('Updating Notification.tenant');
    log.info('====================================');

    const notificationsToUpdate = await notificationsCollection
      .find({ isDeleted: false, createdBy: { $ne: null } })
      .toArray();

    log.info(`Notification records to update: ${notificationsToUpdate.length}`);

    for (const notification of notificationsToUpdate) {
      const createdByUserId = notification.createdBy?.toString();
      const user = contractorMap.get(createdByUserId);

      if (!user || !user._tenantId) {
        stats.missingNotificationTenants++;
        log.warn(
          `Notification ${notification._id} createdBy ${createdByUserId} has no tenant mapping`
        );
        continue;
      }

      if (!DRY_RUN) {
        await notificationsCollection.updateOne(
          { _id: notification._id },
          { $set: { tenant: user._tenantId } }
        );
        stats.notificationsUpdated++;
      } else {
        log.info(
          `[DRY-RUN] Would set Notification.tenant=${user._tenantId} for notification ${notification._id}`
        );
      }
    }

    log.info('====================================');
    log.info('Migration Summary Report');
    log.info('====================================');
    log.info(`Contractor users found:      ${stats.contractorUsersFound}`);
    log.info(`Tenants created:             ${stats.tenantsCreated}`);
    log.info(`Users updated:               ${stats.usersUpdated}`);
    log.info(`Workers updated:             ${stats.workersUpdated}`);
    log.info(`Sites updated:               ${stats.sitesUpdated}`);
    log.info(`Attendance records updated:  ${stats.attendancesUpdated}`);
    log.info(`Payroll records updated:     ${stats.payrollsUpdated}`);
    log.info(`Payment records updated:     ${stats.paymentsUpdated}`);
    log.info(`Notification records updated: ${stats.notificationsUpdated}`);
    log.info(`Missing contractor users:    ${stats.missingContractors}`);
    log.info(`Workers missing tenant:      ${stats.missingWorkerTenants}`);
    log.info(`Sites missing tenant:        ${stats.missingSiteTenants}`);
    log.info(`Attendance missing tenant:   ${stats.missingAttendanceTenants}`);
    log.info(`Payroll missing tenant:      ${stats.missingPayrollTenants}`);
    log.info(`Payment missing tenant:      ${stats.missingPaymentTenants}`);
    log.info(`Notification missing tenant: ${stats.missingNotificationTenants}`);
    log.info('====================================');

    if (DRY_RUN) {
      log.info('Dry-run completed. No data was modified.');
    } else {
      log.success('Migration completed successfully.');
    }

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    log.error(error.stack);
    await disconnectDatabase();
    process.exit(1);
  }
};

runMigration();
