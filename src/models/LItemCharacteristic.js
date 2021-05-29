'use strict';

import {Model} from 'sequelize';

module.exports = class LItemCharacteristic extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            itemCharacteristicId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'ItemCharacteristics'
                }
            },
            itemId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Items'
                }
            },
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.belongsTo(models.ItemCharacteristic, {foreignKey: 'itemCharacteristicId'});
        this.belongsTo(models.Item, {foreignKey: 'itemId'});
    }
}
