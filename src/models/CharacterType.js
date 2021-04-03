'use strict';

const {Model} = require('sequelize');

module.exports = class CharacterType extends Model {
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
            description: {
                allowNull: false,
                type: DataTypes.STRING
            },
            imageUrl: {
                allowNull: false,
                type: DataTypes.STRING
            },
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.hasMany(models.LAvailableItemType, {foreignKey: 'characterTypeId'});
        this.belongsToMany(models.ItemType, {through: models.LAvailableItemType, foreignKey: 'characterTypeId'});
        this.hasMany(models.LDefaultCharacteristic, {foreignKey: 'characterTypeId'});
        this.belongsToMany(models.Characteristic, {through: models.LDefaultCharacteristic, foreignKey: 'characterTypeId'});
    }
}
