import { Router } from 'express';
import { parseISO, startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

// import Appointment from '../models/Appointment';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";


const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.get('/', async (request, response) => {
    console.log(request.user);

    const appointmentsrepository = getCustomRepository(AppointmentsRepository)
    const appointments = await appointmentsrepository.find();

    return response.json(appointments);
})

appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body

    const parsedDate = parseISO(date)

    const createAppointment = new CreateAppointmentService()

    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id
    })

    return response.json(appointment)

})

export default appointmentsRouter;
