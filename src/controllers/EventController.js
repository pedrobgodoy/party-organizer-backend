const Event = require('../models/Event.js');

const { parseDate } = require('../utils/Utils.js');

module.exports = {
    async index(req, res) {
        const events = await Event.find({createdBy: req.auth._id});

        if(events.length === 0){
            return res.status(404).json({response: "Nenhum evento encontrado!"});
        }
        
        return res.json(events);
    },
    async store(req, res){
        const { name, description, date, duration, latitude, longitude, createdBy } = req.body;

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
            location,
            createdBy
        });

        return res.json(event);
    },
    async update(req, res){
        const { name, description, date, duration, latitude, longitude, _id } = req.body;

        const event = await Event.findById(_id);

        if(!event){
            return res.status(404).json({response: "Evento não encontrado!"});
        }

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }

        event.name = name;
        event.description = description;
        event.date = parseDate(date);
        event.duration = duration;
        if(longitude && latitude) event.location = location;

        event.save();

        return res.json(event);
    },
    async delete(req, res){
        const { _id } = req.body;

        const event = await Event.findOne({_id: _id});

        if(!event){
            return res.status(404).json({response: "Evento não encontrado!"});
        }

        if(event.createdBy.toString() != req.auth._id.toString()){
            return res.status(401).json({response: "O Usuário não tem permissão para cancelar este evento!"});
        }

        const deletedEvent = await Event.findByIdAndDelete(_id);

        return res.status(200).json(deletedEvent);
    }
}