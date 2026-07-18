import { StatusCodes } from 'http-status-codes';

import roleRepository from '../repositories/role.repository.js';

import ApiError from '../common/errors/ApiError.js';

import ROLE_MESSAGES from '../common/constants/role.messages.js';

class RoleService {
    /**
     * Create Role
     */
    async createRole(roleData) {
        const {
            name,
            code,
            description,
            permissions,
        } = roleData;

        // Duplicate Name
        const existingName =
            await roleRepository.findByName(name);

        if (existingName) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                ROLE_MESSAGES.NAME_ALREADY_EXISTS
            );
        }

        // Duplicate Code
        const existingCode =
            await roleRepository.findByCode(code);

        if (existingCode) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                ROLE_MESSAGES.CODE_ALREADY_EXISTS
            );
        }

        return await roleRepository.create({
            name,
            code,
            description,
            permissions,
        });
    }

    /**
     * Get Roles
     */
    async getRoles(query) {
        const {
            page = 1,
            limit = 10,
            search = '',
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const filter = {
            isDeleted: false,
        };

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    code: {
                        $regex: search,
                        $options: 'i',
                    },
                },
            ];
        }

        const skip = (page - 1) * limit;

        const options = {
            skip,
            limit: Number(limit),
            sort: {
                [sortBy]:
                    sortOrder === 'asc' ? 1 : -1,
            },
        };

        const roles =
            await roleRepository.findAll(
                filter,
                options
            );

        const total =
            await roleRepository.count(filter);

        return {
            roles,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(
                    total / limit
                ),
            },
        };
    }

    /**
     * Get Role By Id
     */
    async getRoleById(roleId) {
        const role =
            await roleRepository.findById(roleId);

        if (!role) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ROLE_MESSAGES.NOT_FOUND
            );
        }

        return role;
    }

    /**
     * Update Role
     */
    async updateRole(
        roleId,
        updateData
    ) {
        const role =
            await roleRepository.findById(roleId);

        if (!role) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ROLE_MESSAGES.NOT_FOUND
            );
        }

        if (
            updateData.name &&
            updateData.name !== role.name
        ) {
            const existingName =
                await roleRepository.findByName(
                    updateData.name
                );

            if (
                existingName &&
                existingName._id.toString() !== roleId
            ) {
                throw new ApiError(
                    StatusCodes.CONFLICT,
                    ROLE_MESSAGES.NAME_ALREADY_EXISTS
                );
            }
        }

        if (
            updateData.code &&
            updateData.code !== role.code
        ) {
            const existingCode =
                await roleRepository.findByCode(
                    updateData.code
                );

            if (
                existingCode &&
                existingCode._id.toString() !== roleId
            ) {
                throw new ApiError(
                    StatusCodes.CONFLICT,
                    ROLE_MESSAGES.CODE_ALREADY_EXISTS
                );
            }
        }

        return await roleRepository.update(
            roleId,
            updateData
        );
    }

    /**
     * Change Status
     */
    async changeStatus(
        roleId,
        status
    ) {
        const role =
            await roleRepository.findById(roleId);

        if (!role) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ROLE_MESSAGES.NOT_FOUND
            );
        }

        return await roleRepository.changeStatus(
            roleId,
            status
        );
    }

    /**
     * Delete Role
     */
    async deleteRole(roleId) {
        const role =
            await roleRepository.findById(roleId);

        if (!role) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                ROLE_MESSAGES.NOT_FOUND
            );
        }

        await roleRepository.softDelete(
            roleId
        );

        return {
            message:
                ROLE_MESSAGES.DELETED_SUCCESS,
        };
    }
}

export default new RoleService();