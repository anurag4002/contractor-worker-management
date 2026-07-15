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
  async findById(siteId) {
    return await Site.findOne({
      _id: siteId,
      isDeleted: false,
    })
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
  }
/**
 * ==========================================
 * Check Site Exists
 * ==========================================
 */
async findActiveById(siteId) {
  return await Site.findOne({
    _id: siteId,
    isDeleted: false,
    status: 'ACTIVE',
  });
}
  /**
   * ==========================================
   * Find By Site Code
   * ==========================================
   */
  async findBySiteCode(siteCode) {
    return await Site.findOne({
      siteCode,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Find By Site Name
   * ==========================================
   */
  async findBySiteName(siteName) {
    return await Site.findOne({
      siteName,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Find By Contact Number
   * ==========================================
   */
  async findByContactNumber(contactNumber) {
    return await Site.findOne({
      contactNumber,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Find By Email
   * ==========================================
   */
  async findByEmail(email) {
    return await Site.findOne({
      email,
      isDeleted: false,
    });
  }

  /**
   * ==========================================
   * Find Latest Site
   * ==========================================
   */
  async findLatestSite() {
    return await Site.findOne({
      isDeleted: false,
    }).sort({
      siteCode: -1,
    });
  }

  /**
   * ==========================================
   * Get All Sites
   * ==========================================
   */
  async findAll(filter, options) {
    return await Site.find(filter)
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
  async count(filter) {
    return await Site.countDocuments(filter);
  }

  /**
   * ==========================================
   * Update Site
   * ==========================================
   */
  async update(siteId, updateData) {
    return await Site.findOneAndUpdate(
      {
        _id: siteId,
        isDeleted: false,
      },
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
  async changeStatus(siteId, status) {
    return await Site.findOneAndUpdate(
      {
        _id: siteId,
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
   * Soft Delete Site
   * ==========================================
   */
  async softDelete(siteId) {
    return await Site.findOneAndUpdate(
      {
        _id: siteId,
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
   * Get Active Sites
   * ==========================================
   */
  async findActiveSites() {
    return await Site.find({
      status: 'ACTIVE',
      isDeleted: false,
    });
  }
}

export default new SiteRepository();