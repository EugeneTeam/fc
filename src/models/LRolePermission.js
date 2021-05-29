'use strict';

import {Model} from 'sequelize';

module.exports = class LRolePermission extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            role: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.STRING,
                references: {
                    model: 'Roles'
                },
                onDelete: 'CASCADE'
            },
            permissionId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Permissions'
                },
                onDelete: 'CASCADE'
            }
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.belongsTo(models.Role,  {foreignKey: 'role'});
        this.belongsTo(models.Permission, {foreignKey: 'permissionId'});
    }
}
