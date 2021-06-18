import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        )

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '121212'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('121212');
    })

    it('should not be able to create two appointment at same hour', async () => {
        const fakeAppointmentRepository = new FakeAppointmentRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        )

        const appointmentDate = new Date(2020, 4, 10, 11);

        const appointment = await createAppointment.execute({
            date: appointmentDate,
            provider_id: '121212'
        });
        expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '121212'
        })).rejects.toBeInstanceOf(AppError)
    })
})