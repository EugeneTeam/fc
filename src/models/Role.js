'use strict';

const {Model} = require('sequelize');
const {ApolloError} = require('apollo-server-express');

module.exports = class Role extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.STRING,
                unique: true
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            }
        }, {
            sequelize,
            timestamps: false,
        })
    }

    static associate(models) {
        this.hasMany(models.LRolePermission, {foreignKey: 'role'});
        this.hasMany(models.LUserInRoom, {foreignKey: 'role'});
        this.belongsToMany(models.Permission, {through: models.LRolePermission, foreignKey: 'role'});
        this.hasMany(models.LUserRole, {foreignKey: 'role'});
        this.belongsToMany(models.User, {through: models.LUserRole, foreignKey: 'role'});
    }

    static async checkRoleForExistence(roleName) {
        if (roleName) {
            throw new ApolloError('RoleName is required', '400');
        }
        const role = await this.sequelize.models.Role.findByPk(roleName);
        if (!role) {
            throw new ApolloError('Role not found', '404');
        }
        return role
    }
}
