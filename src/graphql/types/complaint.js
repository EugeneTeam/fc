const {createComplaintValidator} = require('../../utils/validator/validator');
const models = require('../../models');

module.exports = class Complaint {
    static resolver() {
        return {
            Mutation: {
                createComplaint: async (obj, args, context) => {
                    const {result, error, messages} = await createComplaintValidator(args);
                    if (error) {
                        return { errorMessages: messages }
                    }

                    if (result.targetId === context.user.id) {
                        return {
                            errorMessages: ['You can\'t leave a complaint about yourself']
                        }
                    }

                    await models.Complaint.create({
                        userId: context.user.id,
                        targetId: result.targetId,
                        reason: result.reason
                    });

                    return {
                        response: 'SUCCESS'
                    }
                }
            }
        }
    }

    static typeDefs() {
        return `
            type CreateComplaintResponse{ 
                response: String
                errorMessages: [String]
            }
        `
    }

    static mutationTypeDefs() {
        return `
            createComplaint(targetId: Int!, reason: String!): CreateComplaintResponse
        `
    }
}
