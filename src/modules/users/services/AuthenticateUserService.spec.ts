import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService';

describe('AuthUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider()

        const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)
        const authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with wrong password', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider()

        const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider)
        const authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(
            authenticateUser.execute({
                email: 'johndoe@example.com',
                password: '654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with non existing user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProvider = new FakeHashProvider()

        const authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

        expect(
            authenticateUser.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
})