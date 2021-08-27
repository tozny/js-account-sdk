"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Information about a group in an identity realm.
 */
class Group {
    constructor(id, name, path, attributes, subGroups) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.attributes = attributes;
        this.subGroups = subGroups;
    }
    /**
     * Specify how an already unserialized JSON array should be marshaled into
     * an object representation.
     *
     * <code>
     * identity = Group::decode({
     *   id: '00000000-0000-0000-0000-000000000000',
     *   name: 'exampleGroup',
     *   path: '/exampleGroup',
     *   attributes: { key1: 'value1' },
     *   sub_groups: []
     * })
     * <code>
     *
     * @param {object} json
     *
     * @return {<Group>}
     */
    static decode(json) {
        const attributes = transformAttributes(json.attributes || {});
        return new Group(json.id, json.name, json.path, attributes, json.subGroups || []);
    }
}
// transformAttributes converts from single element array to string
// { key1: ['value1']} becomes { key1: 'value1' }
function transformAttributes(apiAttributes) {
    const attributes = {};
    for (const [key, value] of Object.entries(apiAttributes || {})) {
        attributes[key] = apiAttributes[key][0];
    }
    return attributes;
}
exports.default = Group;
