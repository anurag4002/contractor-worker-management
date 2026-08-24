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
  async findById(workerId, tenantId = null) {
    const query = {
      _id: workerId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOne(query)
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
  async findByEmployeeCode(employeeCode, tenantId = null) {
    const query = {
      employeeCode,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOne(query);
  }

  /**
   * ==========================================
   * Find By Mobile Number
   * ==========================================
   */
  async findByMobileNumber(mobileNumber, tenantId = null) {
    const query = {
      mobileNumber,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOne(query);
  }

  /**
   * ==========================================
   * Find By Aadhaar Number
   * ==========================================
   */
  async findByAadhaarNumber(aadhaarNumber, tenantId = null) {
    const query = {
      aadhaarNumber,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOne(query);
  }

  /**
   * ==========================================
   * Find By PAN Number
   * ==========================================
   */
  async findByPanNumber(panNumber, tenantId = null) {
    const query = {
      panNumber,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOne(query);
  }

  /**
   * ==========================================
   * Get All Workers
   * ==========================================
   */
  async findAll(filter, options, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Worker.find(query)
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
  async count(filter, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Worker.countDocuments(query);
  }

  /**
   * ==========================================
   * Update Worker
   * ==========================================
   */
  async update(workerId, updateData, tenantId = null) {
    const query = {
      _id: workerId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOneAndUpdate(
      query,
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
  async changeStatus(workerId, status, tenantId = null) {
    const query = {
      _id: workerId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOneAndUpdate(
      query,
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
  async softDelete(workerId, tenantId = null) {
    const query = {
      _id: workerId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOneAndUpdate(
      query,
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
  async findActiveWorkers(tenantId = null) {
    const query = {
      status: 'ACTIVE',
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.find(query)
      .populate('site')
      .populate('contractor');
  }

  /**
   * ==========================================
   * Get Workers By Site
   * ==========================================
   */
  async findBySite(siteId, tenantId = null) {
    const query = {
      site: siteId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.find(query)
      .populate('site')
      .populate('contractor');
  }

  async findManyByIds(workerIds, tenantId = null) {
    const query = {
      _id: { $in: workerIds },
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.find(query);
  }

  async assignToSite(siteId, workerIds, assignedBy, session = null, tenantId = null) {
    const query = {
      _id: { $in: workerIds },
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.updateMany(
      query,
      {
        $set: {
          site: siteId,
          updatedBy: assignedBy,
        },
      },
      session ? { session } : {}
    );
  }
  /**
   * ==========================================
   * Find Latest Worker
   * ==========================================
   */
  async findLatestWorker(tenantId = null) {
    const query = {
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Worker.findOne(query).sort({
      employeeCode: -1,
    });
  }
}

export default new WorkerRepository();
