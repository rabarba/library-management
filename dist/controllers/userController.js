"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const getUsers = (req, res) => {
    res.status(200).json([{ id: 1, name: 'John Doe' }]);
};
exports.getUsers = getUsers;
