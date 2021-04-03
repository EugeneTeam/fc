'use strict';

const {Model} = require('sequelize');

module.exports = class ItemCharacteristic extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            characteristicId: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            value: {
                allowNull: false,
                type: DataTypes.FLOAT
            }
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {

    }
}
