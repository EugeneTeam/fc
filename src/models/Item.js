'use strict';

import {Model} from 'sequelize';

module.exports = class Item extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
            description: {
                allowNull: false,
                type: DataTypes.TEXT
            },
            imageUrl: {
                allowNull: false,
                type: DataTypes.STRING
            }
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.hasMany(models.LItemCharacteristic, {foreignKey: 'itemId'});
        this.belongsToMany(models.ItemCharacteristic, {through: models.LItemCharacteristic, foreignKey: 'itemId'});
        this.hasMany(models.LPlayerSlot, {foreignKey: 'itemId'});
    }
}
