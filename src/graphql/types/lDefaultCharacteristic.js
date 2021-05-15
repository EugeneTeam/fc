
module.exports = class LDefaultCharacteristic {
    static resolver() {
        return {
            LDefaultCharacteristic: {
                characteristics: parent => parent.getCharacteristic()
            }
        }
    }
    static typeDefs() {
        return `
            type LDefaultCharacteristic {
                characterId: Int
                characteristicId: Int
                value: Float
                characteristics: Characteristic
            }
        `;
    }
}
