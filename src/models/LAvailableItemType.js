'use strict';

import {Model} from 'sequelize';

module.exports = class LAvailableItemType extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            itemTypeId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'ItemTypes'
                }
            },
            characterTypeId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'CharacterTypes'
                }
            },
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.belongsTo(models.ItemType, {foreignKey: 'itemTypeId'});
        this.belongsTo(models.CharacterType, {foreignKey: 'characterTypeId'});
    }
}
