'use strict';

import {Model} from 'sequelize';

module.exports = class Permission extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            },
            createdAt: {
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                type: DataTypes.DATE
            },
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.hasMany(models.LRolePermission, {foreignKey: 'permissionId'});
        this.belongsToMany(models.Role, {through: models.LRolePermission, foreignKey: 'permissionId'});
    }
}
