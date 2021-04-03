'use strict';

const {Model} = require('sequelize');

module.exports = class Player extends Model {
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
            characterTypeId: {
                allowNull: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'CharacterTypes'
                },
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users'
                },
                onDelete: 'CASCADE'
            },
            agility: {
                allowNull: false,
                type: DataTypes.FLOAT
            },
            strength: {
                allowNull: false,
                type: DataTypes.FLOAT
            },
            intelligence: {
                allowNull: false,
                type: DataTypes.FLOAT
            },
            armor: {
                allowNull: false,
                type: DataTypes.FLOAT
            },
            hp: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            currentLevel: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            currentExperience: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            nextLevelExperience: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            createdAt: {
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                type: DataTypes.DATE
            },
        }, {
            sequelize
        })
    }

    static associate(models) {

    }
}
