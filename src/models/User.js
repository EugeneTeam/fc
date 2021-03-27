'use strict';

const {Model} = require('sequelize');

module.exports = class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            nickname: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            },
            passwordHash: {
                type: DataTypes.STRING
            },
            authKey: {
                type: DataTypes.STRING
            },
            resetKey: {
                type: DataTypes.STRING
            },
            status: {
                allowNull: false,
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED')
            },
            banReason: {
                type: DataTypes.STRING
            },
            activationKey: {
                type: DataTypes.STRING
            },
            roleId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Roles'
                },
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
        this.belongsTo(models.Role, {foreignKey: 'roleId'});
        this.hasMany(models.Complaint, {foreignKey: 'userId', as: 'userReport'});
        this.hasMany(models.Complaint, {foreignKey: 'targetId', as: 'userTarget'});
        this.hasMany(models.LUserInRoom, {foreignKey: 'userId'});
        this.hasMany(models.Room, {foreignKey: 'creatorId'});
        this.belongsToMany(models.Room, {through: models.LUserInRoom, foreignKey: 'userId'});
        this.hasMany(models.Message, {foreignKey: 'userId'});
    }
}
