import express from 'express';
import argon2 from 'argon2';
import debug from 'debug';

import usersService from '../services/users.service';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    private static instance: UsersController;
    static getInstance(): UsersController {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }

    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        return res.status(200).json(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.params.id);
        return res.status(200).json(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const user = await usersService.create(req.body);
        return res.status(200).json(user);
    }

    async patch(req: express.Request, res: express.Response) {
        if(req.body.password){
            req.body.password = await argon2.hash(req.body.password);
        }
        const user = await usersService.patchById(req.body);
        return res.status(200).json(user);
    }

    async put(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const user = await usersService.updateById({id: req.params.id, ...req.body});
        return res.status(200).json(user);
    }

    async removeUser(req: express.Request, res: express.Response) {
        const user = await usersService.deleteById(req.params.id);
        return res.status(200).json(user);
    }
}

export default UsersController.getInstance();