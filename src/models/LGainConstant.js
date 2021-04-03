'use strict';

const {Model} = require('sequelize');

module.exports = class LGainConstant extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            characterTypeId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'CharacterTypes'
                }
            },
            characteristicId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Characteristics'
                }
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
        this.belongsTo(models.CharacterType, {foreignKey: 'characterTypeId'});
        this.belongsTo(models.Characteristic, {foreignKey: 'characteristicId'});
    }
}
