import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UserAvatar', () => {
    it('should be able to user avatar', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider()

        const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        })

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar of non exisisting user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider()

        const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

        expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'avatar.jpg',
            })
        ).rejects.toBeInstanceOf(AppError);
    });


    it('should delete old avatar before update with new one', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider()

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        })

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
        expect(user.avatar).toBe('avatar2.jpg');
    });
})