'use strict';

import {Model} from 'sequelize';

module.exports = class LUserInRoom extends Model {
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
            userId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users'
                },
                onDelete: 'CASCADE'
            },
            roomId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Rooms'
                },
                onDelete: 'CASCADE'
            },
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.belongsTo(models.Role, {foreignKey: 'role'});
        this.belongsTo(models.User, {foreignKey: 'userId'});
        this.belongsTo(models.Room, {foreignKey: 'roomId'});
    }
}
