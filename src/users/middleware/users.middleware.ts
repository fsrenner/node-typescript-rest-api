import express from 'express';
import userService from '../services/users.service';

class UsersMiddleware {
    private static instance: UsersMiddleware;

    static getInstance() {
        if (!UsersMiddleware.instance) {
            UsersMiddleware.instance = new UsersMiddleware();
        }
        return UsersMiddleware.instance;
    }

    async validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        let error = '';
        if (!req.body.password) {
            error += 'The password was missing. ';
        }
        if (!req.body.email) {
            error += 'The email was missing.';
        }

        if (error) {
            return res.status(400).json({ error });
        } else {
            next();
        }
    }

    async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user) {
            return res.status(400).json({error: `User email already exists`});
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user && user.id === req.params.id) {
            next();
        } else {
            return res.status(400).json({error: `Invalid email`});
        }
    }

    async validatePatchEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body.email) {
            UsersMiddleware.getInstance().validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    }

    async validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const user = await userService.readById(req.params.id);
        if (user) {
            next();
        } else {
            res.status(404).json({error: `User ${req.params.id} not found`});
        }
    }

    async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }
    
}

export default UsersMiddleware.getInstance();