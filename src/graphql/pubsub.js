const {PubSub} = require('graphql-subscriptions');

module.exports = {
    _instance: null,
    get instance() {
        if (!this._instance) {
            this._instance = new PubSub()
        }
        return this._instance
    }
}
