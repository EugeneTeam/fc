const models = require('../../models');
const {transform, reductionToOneFormat} = require('../../utils/converter')

module.exports = class Complaint {
    static resolver() {
        return {
            Mutation: {
                createComplaint: async (obj, {targetId, reason}, context) => {
                    const complaint = await models.Complaint.findOne({
                        where: {
                            userId: context.user.id,
                            targetId
                        }
                    })
                    if (complaint) {
                        return transform(null, {
                            code: 400,
                            message: 'You have previously left a complaint about this player'
                        })
                    }

                    const newComplaint = await models.Complaint.create({
                        userId: context.user.id,
                        targetId: targetId,
                        reason: reason
                    });
                    return transform(newComplaint)
                }
            }
        }
    }

    static typeDefs() {
        return `
            type Complaint {
                userId: Int
                targetId: Int
                reason: String
            }
            ${reductionToOneFormat('Complaint','ComplaintResponse')}
        `
    }

    static mutationTypeDefs() {
        return `
            createComplaint(targetId: Int!, reason: String!): ComplaintResponse
        `
    }
}
