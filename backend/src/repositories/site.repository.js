import Site from '../models/Site.js';

class SiteRepository {
  /**
   * ==========================================
   * Create Site
   * ==========================================
   */
  async create(siteData) {
    return await Site.create(siteData);
  }

  /**
   * ==========================================
   * Find Site By Id
   * ==========================================
   */
  async findById(siteId, tenantId = null) {
    const query = {
      _id: siteId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOne(query)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
  }
  /**
   * ==========================================
   * Check Site Exists
   * ==========================================
   */
  async findActiveById(siteId, tenantId = null) {
    const query = {
      _id: siteId,
      isDeleted: false,
      status: 'ACTIVE',
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOne(query);
  }
  /**
   * ==========================================
   * Find By Site Code
   * ==========================================
   */
  async findBySiteCode(siteCode, tenantId = null) {
    const query = {
      siteCode,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOne(query);
  }

  /**
   * ==========================================
   * Find By Site Name
   * ==========================================
   */
  async findBySiteName(siteName, tenantId = null) {
    const query = {
      siteName,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOne(query);
  }

  /**
   * ==========================================
   * Find By Contact Number
   * ==========================================
   */
  async findByContactNumber(contactNumber, tenantId = null) {
    const query = {
      contactNumber,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOne(query);
  }

  /**
   * ==========================================
   * Find By Email
   * ==========================================
   */
  async findByEmail(email, tenantId = null) {
    const query = {
      email,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOne(query);
  }

  /**
   * ==========================================
   * Find Latest Site
   * ==========================================
   */
  async findLatestSite(tenantId = null) {
    const query = {
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOne(query).sort({
      siteCode: -1,
    });
  }

  /**
   * ==========================================
   * Get All Sites
   * ==========================================
   */
  async findAll(filter, options, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Site.find(query)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * ==========================================
   * Count Sites
   * ==========================================
   */
  async count(filter, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Site.countDocuments(query);
  }

  /**
   * ==========================================
   * Update Site
   * ==========================================
   */
  async update(siteId, updateData, tenantId = null) {
    const query = {
      _id: siteId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOneAndUpdate(
      query,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    )
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
  }

  /**
   * ==========================================
   * Change Site Status
   * ==========================================
   */
  async changeStatus(siteId, status, tenantId = null) {
    const query = {
      _id: siteId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOneAndUpdate(
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
   * Soft Delete Site
   * ==========================================
   */
  async softDelete(siteId, tenantId = null) {
    const query = {
      _id: siteId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOneAndUpdate(
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
   * Get Active Sites
   * ==========================================
   */
  async findActiveSites(tenantId = null) {
    const query = {
      status: 'ACTIVE',
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.find(query);
  }

  async addWorkers(siteId, workerIds, session = null, tenantId = null) {
    const query = {
      _id: siteId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Site.findOneAndUpdate(
      query,
      {
        $addToSet: {
          workers: {
            $each: workerIds,
          },
        },
      },
      {
        returnDocument: 'after',
        session,
      }
    );
  }
}

export default new SiteRepository();
