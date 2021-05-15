
module.exports = class LGainConstant {
    static resolver() {
        return {
            LGainConstant: {
                characteristics: parent => parent.getCharacteristic()
            }
        }
    }
    static typeDefs() {
        return `
            type LGainConstant {
                characterId: Int
                characteristicId: Int
                value: Float
                characteristics: Characteristic
            }
        `;
    }
}
