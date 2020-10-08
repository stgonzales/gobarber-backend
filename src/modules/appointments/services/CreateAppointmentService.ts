import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import AppError from '@shared/errors/AppError'


interface Request {
    provider_id: string;
    date: Date;
}


class CreateAppointmentService {
    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date)

        const findAppointmentSameDate = await appointmentsRepository.find({
            where: { date: appointmentDate, provider_id }
        })

        if (findAppointmentSameDate.length > 0) {
            throw new AppError('This appoiment date and time is not available');
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        })

        await appointmentsRepository.save(appointment)

        return appointment;
    }
}

export default CreateAppointmentService;