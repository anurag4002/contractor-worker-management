import Worker from '../models/Worker.js';

class WorkerRepository {
  /**
   * ==========================================
   * Create Worker
   * ==========================================
   */
  async create(workerData) {
    return await Worker.create(workerData);
  }

  /**
   * ==========================================
   * Find Worker By Id
   * ==========================================
   */
  async findById(workerId) {
    return await Worker.findOne({
      _id: workerId,
      isDeleted: false,
    })
      // .populate('site')
      // .populate('contractor')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
  }

  /**
   * ==========================================
   * Find By Employee Code
   * ==========================================
   */
  async findByEmployeeCode(employeeCode) {
    return await Worker.findOne({
      employeeCode,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Find By Mobile Number
   * ==========================================
   */
  async findByMobileNumber(mobileNumber) {
    return await Worker.findOne({
      mobileNumber,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Find By Aadhaar Number
   * ==========================================
   */
  async findByAadhaarNumber(aadhaarNumber) {
    return await Worker.findOne({
      aadhaarNumber,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Find By PAN Number
   * ==========================================
   */
  async findByPanNumber(panNumber) {
    return await Worker.findOne({
      panNumber,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Get All Workers
   * ==========================================
   */
  async findAll(filter, options) {
    return await Worker.find(filter)
      // .populate('site')
      // .populate('contractor')
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * ==========================================
   * Count Workers
   * ==========================================
   */
  async count(filter) {
    return await Worker.countDocuments(filter);
  }

  /**
   * ==========================================
   * Update Worker
   * ==========================================
   */
  async update(workerId, updateData) {
    return await Worker.findOneAndUpdate(
      {
        _id: workerId,
        isDeleted: false,
      },
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    )
      .populate('site')
      .populate('contractor')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
  }

  /**
   * ==========================================
   * Change Worker Status
   * ==========================================
   */
  async changeStatus(workerId, status) {
    return await Worker.findOneAndUpdate(
      {
        _id: workerId,
        isDeleted: false,
      },
      {
        status,
      },
      {
        returnDocument: 'after',
      }
    );
  }

  /**
   * ==========================================
   * Soft Delete Worker
   * ==========================================
   */
  async softDelete(workerId) {
    return await Worker.findOneAndUpdate(
      {
        _id: workerId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        returnDocument: 'after',
      }
    );
  }

  /**
   * ==========================================
   * Get Active Workers
   * ==========================================
   */
  async findActiveWorkers() {
    return await Worker.find({
      status: 'ACTIVE',
      isDeleted: false,
    })
      .populate('site')
      .populate('contractor');
  }

  /**
   * ==========================================
   * Get Workers By Site
   * ==========================================
   */
  async findBySite(siteId) {
    return await Worker.find({
      site: siteId,
      isDeleted: false,
    })
      .populate('site')
      .populate('contractor');
  }
  /**
 * ==========================================
 * Find Latest Worker
 * ==========================================
 */
async findLatestWorker() {
  return await Worker.findOne({
    isDeleted: false,
  }).sort({
    employeeCode: -1,
  });
}
}

export default new WorkerRepository();