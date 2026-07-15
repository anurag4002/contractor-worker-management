import workerRepository from '../../repositories/worker.repository.js';

/**
 * ==========================================
 * Generate Employee Code
 * ==========================================
 *
 * Format:
 * EMP00001
 * EMP00002
 * EMP00003
 *
 */
export const generateEmployeeCode = async () => {
  const latestWorker =
    await workerRepository.findLatestWorker();

  if (!latestWorker) {
    return 'EMP00001';
  }

  const lastNumber = Number(
    latestWorker.employeeCode.replace(
      'EMP',
      ''
    )
  );

  return `EMP${String(lastNumber + 1).padStart(
    5,
    '0'
  )}`;
};