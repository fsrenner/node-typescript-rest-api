import shortid from 'shortid';
import debug from 'debug';

import { UsersDto } from "../dto/users.model";

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
    private static instance: UsersDao;
    users: Array<UsersDto> = [];

    constructor() {
        log('Created new instance of UsersDao');
    }

    static getInstance(): UsersDao {
        if (!UsersDao.instance) {
            UsersDao.instance = new UsersDao();
        }
        return UsersDao.instance;
    }

    // Create
    async addUser(user: UsersDto) {
        user.id = shortid.generate();
        this.users.push(user);
        return user;
    }

    // Read
    async getUsers() {
        return this.users;
    }

    async getUserById(userId: string) {
        return this.users.find((user: { id: string}) => user.id === userId);
    }

    async getUserByEmail(email: string) {
        return this.users.find((user: { email: string}) => user.email === email);
    }

    // Update
    async putUserById(user: UsersDto) {
        const objIndex = this.users.findIndex((obj: { id: string; }) => obj.id === user.id);
        this.users.splice(objIndex, 1, user);
        return this.users.find((updatedUser: { id: string; }) => updatedUser.id === user.id);
    }

    async patchUserById(user: UsersDto) {
        const objIndex = this.users.findIndex((obj: { id: string; }) => obj.id === user.id);
        let currentUser = this.users[objIndex];
        const allowedPatchFields = ["password", "firstName", "lastName", "permissionLevel"];
        for (let field of allowedPatchFields) {
            if (field in user) {
                // @ts-ignore
                currentUser[field] = user[field];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return this.users.find((patchedUser: { id: string; }) => patchedUser.id === user.id);
    }

    // Delete
    async removeUserById(id: string) {
        const userIndex = this.users.findIndex((user: { id: string; }) => user.id === id);
        const user = this.users[userIndex];
        this.users.splice(userIndex, 1);
        return user;
    }
}

export default UsersDao.getInstance();

