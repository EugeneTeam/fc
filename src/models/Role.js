'use strict';

const {Model} = require('sequelize');

module.exports = class Role extends Model {
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
        this.hasMany(models.LRolePermission, {foreignKey: 'roleId'});
        this.hasMany(models.User, {foreignKey: 'roleId'});
        this.hasMany(models.LUserInRoom, {foreignKey: 'roleId'});
        this.belongsToMany(models.Permission, {through: models.LRolePermission, foreignKey: 'roleId'});
    }
}
