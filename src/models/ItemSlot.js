'use strict';

const {Model} = require('sequelize');

module.exports = class ItemSlot extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            itemTypeId: {
                allowNull: false,
                type: DataTypes.INTEGER
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
        this.belongsTo(models.ItemType, {foreignKey: 'itemTypeId'});
        this.hasMany(models.LPlayerSlot, {foreignKey: 'itemSlotId'});
        this.belongsToMany(models.Player, {through: models.LPlayerSlot, foreignKey: 'itemSlotId'});
    }
}
