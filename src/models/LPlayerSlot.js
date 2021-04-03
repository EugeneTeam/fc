'use strict';

const {Model} = require('sequelize');

module.exports = class LPlayerSlot extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            itemSlotId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                reference: {
                    model: 'ItemSlots'
                }
            },
            itemId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Items'
                }
            },
            playerId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                reference: {
                    model: 'Players'
                }
            }
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {

    }
}
