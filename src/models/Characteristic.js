'use strict';

const {Model} = require('sequelize');

module.exports = class Characteristic extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.hasMany(models.ItemCharacteristic, {foreignKey: 'characteristicId'});
        this.hasMany(models.LDefaultCharacteristic, {foreignKey: 'characteristicId'});
        this.belongsToMany(models.CharacterType, {through: models.LDefaultCharacteristic, foreignKey: 'characteristicId'});

        this.hasMany(models.LGainConstant, {foreignKey: 'characteristicId'});
        this.belongsToMany(models.CharacterType, {through: models.LGainConstant, foreignKey: 'characteristicId'});
    }
}
