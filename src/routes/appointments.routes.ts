import { Router } from 'express';
import { parseISO, startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsrepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
    const appointments = appointmentsrepository.all();

    return response.json(appointments);
})

appointmentsRouter.post('/', (request, response) => {
    try {
        const { provider, date } = request.body

        const parsedDate = parseISO(date)

        const createAppointment = new CreateAppointmentService(appointmentsrepository)
        const appointment = createAppointment.execute({ date: parsedDate, provider })

        return response.json(appointment)

    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})

export default appointmentsRouter;
