'use strict';

const {Model} = require('sequelize');

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
        this.hasMany(models.User, {foreignKey: 'role'});
        this.hasMany(models.LUserInRoom, {foreignKey: 'role'});
        this.belongsToMany(models.Permission, {through: models.LRolePermission, foreignKey: 'role'});
    }
}
