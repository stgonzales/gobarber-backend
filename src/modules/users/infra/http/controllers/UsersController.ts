import { Request, Response } from "express";
import { container } from 'tsyringe';


import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

import CreateUserService from "@modules/users/services/CreateUserService";

interface IUser {
    name: string;
    email: string;
    password?: string;
}

export default class UsersController {
    public async index(request: Request, response: Response): Promise<Response> {
        const usersRepository = new UsersRepository();

        const users = await usersRepository.findAllUsers()

        return response.json(users)
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUserService);

        const user: IUser = await createUser.execute({
            name,
            email,
            password,
        })

        delete user.password;

        return response.json(user)
    }
}