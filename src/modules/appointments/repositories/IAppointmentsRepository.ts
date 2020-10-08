import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

export default interface IAppointmentsRepository {
    findByDate(date: Date): Promise<Appointment | null>;
}