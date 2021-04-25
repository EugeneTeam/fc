module.exports = {
    /**
     *
     * @param req
     * @returns {null|*|string}
     */
    getMethodNameFromQueryString: req => {
        if (!req || !req.body || !req.body.query) {
            return null;
        }
        let temp = req.body.query.replace(/[\n]/g, '').replace(/[ ]/g, '');
        const isCase1 = temp[0] === '{';
        const end = temp.substring(1, temp.length).search(/[{}()]/g);
        const result = temp.substring(isCase1 ? 1 : 'query'.length, end + 1);
        if (result === 'IntrospectionQuery') {
            return null;
        }
        return result;
    }
}
