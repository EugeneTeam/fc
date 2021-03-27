'use strict';

const {Model} = require('sequelize');

module.exports = class LRolePermission extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            roleId: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Roles'
                },
                onDelete: 'CASCADE'
            },
            permissionId: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
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
        this.belongsTo(models.Role,  {foreignKey: 'roleId'});
        this.belongsTo(models.Permission, {foreignKey: 'permissionId'});
    }
}
