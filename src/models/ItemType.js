'use strict';

import {Model} from 'sequelize';

module.exports = class ItemType extends Model {
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
        this.hasMany(models.ItemSlot, {foreignKey: 'itemTypeId'});
        this.hasMany(models.LAvailableItemType, {foreignKey: 'itemTypeId'});
        this.belongsToMany(models.CharacterType, {through: models.LAvailableItemType, foreignKey: 'itemTypeId'});
    }
}
