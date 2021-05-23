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
                type: DataTypes.INTEGER,
                references: {
                    model: 'Characteristics'
                }
            },
            value: {
                allowNull: false,
                type: DataTypes.DECIMAL(10,2)
            }
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.belongsTo(models.Characteristic, {foreignKey: 'characteristicId'});
        this.hasMany(models.LItemCharacteristic, {foreignKey: 'itemCharacteristicId'});
        this.belongsToMany(models.Item, {through: models.LItemCharacteristic, foreignKey: 'itemCharacteristicId'});
    }
}
