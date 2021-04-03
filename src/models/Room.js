'use strict';

const {Model} = require('sequelize');
module.exports = class Room extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            creatorId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users'
                },
                onDelete: 'CASCADE'
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
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
        this.belongsTo(models.User, {foreignKey: 'creatorId'});
        this.hasMany(models.LUserInRoom, {foreignKey: 'roomId'});
        this.belongsToMany(models.User, {through: models.LUserInRoom, foreignKey: 'roomId'});
        this.hasMany(models.Message, {foreignKey: 'roomId'});
    }

    async addedUsersToTheRoom(userIds, transaction ) {
        if (!userIds || !userIds.length) {
            return;
        }

        for (const id of userIds) {
            await this.sequelize.models.User.addRoleForUser('Room-member');
            await this.sequelize.models.LUserInRoom.create({
                role: 'Room-member',
                userId: id,
                roomId: this.id
            }, {
                transaction
            })
        }
    }
}
