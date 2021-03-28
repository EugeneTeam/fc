'use strict';

const {Model} = require('sequelize');

module.exports = class Message extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users'
                },
                onDelete: 'CASCADE'
            },
            parentId: {
                allowNull: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Messages'
                },
                onDelete: 'CASCADE'
            },
            roomId: {
                allowNll: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Rooms'
                },
                onDelete: 'CASCADE'
            },
            message: {
                allowNull: false,
                type: DataTypes.STRING(255),
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
        this.belongsTo(models.User, {foreignKey: 'userId'});
        this.belongsTo(models.Message, {foreignKey: 'parentId', as: 'parentMessageFrom'});
        this.hasMany(models.Message, {foreignKey: 'parentId', as: 'parentMessageTo'});
        this.belongsTo(models.Room, {foreignKey: 'roomId'});
    }
}
