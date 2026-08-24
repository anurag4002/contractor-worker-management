const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';

export const getTenantId = (req) => {
  return req.user?.tenantId || null;
};

export const getRole = (req) => {
  return req.user?.role || null;
};

export const isSuperAdmin = (req) => {
  return getRole(req) === SUPER_ADMIN_ROLE;
};

export const requireTenant = () => {
  return (req, res, next) => {
    const tenantId = getTenantId(req);
    const role = getRole(req);

    if (!tenantId && !isSuperAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Tenant context is required.',
      });
    }

    next();
  };
};

export const withTenant = (filter, tenantId) => {
  if (tenantId) {
    return {
      ...filter,
      tenant: tenantId,
    };
  }
  return filter;
};

export const withTenantId = (query, tenantId) => {
  if (tenantId) {
    return {
      ...query,
      tenant: tenantId,
    };
  }
  return query;
};

export const assertTenantAccess = (req, tenantId) => {
  if (isSuperAdmin(req)) {
    return true;
  }

  const userTenantId = getTenantId(req);

  if (!userTenantId) {
    return false;
  }

  if (tenantId && userTenantId.toString() !== tenantId.toString()) {
    return false;
  }

  return true;
};
