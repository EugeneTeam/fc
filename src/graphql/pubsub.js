import {PubSub} from 'graphql-subscriptions'

export default {
    _instance: null,
    get instance() {
        if (!this._instance) {
            this._instance = new PubSub()
        }
        return this._instance
    }
}
