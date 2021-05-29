'use strict';

import {Model} from 'sequelize';

module.exports = class Complaint extends Model {
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
            targetId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users'
                },
                onDelete: 'CASCADE'
            },
            reason: {
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
        this.belongsTo(models.User, {foreignKey: 'userId', as: 'userReport'});
        this.belongsTo(models.User, {foreignKey: 'targetId', as: 'userTarget'});
    }
}
