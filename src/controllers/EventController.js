const Event = require('../models/Event.js');

const { parseDate } = require('../utils/Utils.js');

module.exports = {
    async index(request, response) {
        const events = await Event.find();
        return response.json(events);
    },
    async store(request, response){
        const { name, description, date, duration, latitude, longitude } = request.body;

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };

        console.log(location);

        const eventDate = parseDate(date);

        const event = await Event.create({
            name,
            description,
            date: eventDate,
            duration,
            location
        });

        return response.json(event);
    }
}