"use strict";
/**
 * Information about a group in an identity realm.
 */
class Group {
    constructor(id, name, path, subGroups) {
        this.id = id;
        this.name = name;
        this.path = path;
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
     *   sub_groups: []
     * })
     * <code>
     *
     * @param {object} json
     *
     * @return {<Group>}
     */
    static decode(json) {
        return new Group(json.id, json.name, json.path, json.sub_groups);
    }
}
module.exports = Group;
