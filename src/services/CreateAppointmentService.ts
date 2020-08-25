import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns';

interface Request {
    provider: string;
    date: Date;
}


class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepository;

    constructor(appoinmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appoinmentsRepository
    }

    public execute({ date, provider }: Request) {

        const appointmentDate = startOfHour(date)

        const findAppointmentSameDate = this.appointmentsRepository.findByDate(date)

        if (findAppointmentSameDate) {
            throw Error('This appoiment date and time is not available');
        }

        const appointment = this.appointmentsRepository.create({ provider, date: appointmentDate })

        return appointment;
    }
}

export default CreateAppointmentService;
