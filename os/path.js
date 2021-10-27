"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Path {
    static join(...args) {
        return args.map((part, i) => {
            if (i === 0) {
                return part.trim().replace(/[\/]*$/g, '');
            }
            else {
                return part.trim().replace(/(^[\/]*|[\/]*$)/g, '');
            }
        }).filter(x => x.length).join('/');
    }
}
exports.default = Path;
