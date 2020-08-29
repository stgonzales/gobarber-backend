import { Router } from 'express';
import { parseISO, startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

// import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsrepository = getCustomRepository(AppointmentsRepository)
    const appointments = await appointmentsrepository.find();

    return response.json(appointments);
})

appointmentsRouter.post('/', async (request, response) => {
    try {
        const { provider_id, date } = request.body

        const parsedDate = parseISO(date)

        const createAppointment = new CreateAppointmentService()

        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider_id
        })

        return response.json(appointment)

    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})

export default appointmentsRouter;
