import mongoose from "mongoose";
import { addEventToUser, removeEventFromUser } from './user.model.js'

// Event Schema

const eventSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    beginning: { type: Date, required: true},
    duration: { type: Number, required: true},
    start: { type: String, required: true},
    end: { type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    participants: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    attending: {type: Number}
},{ timestamps: true });


// erstelle neues Model-Objekt fuer Event
const Event = mongoose.model('Event', eventSchema);


// DB-Funktion zum Abrufen eines bestimmten Event-Eintrags per Event-Titel
export async function findEventByEventTitle(eventTitle) {
    return await Event.findOne({eventTitle: eventTitle}).populate('participants');
}

// DB-Funktion zum Abrufen eines bestimmten Event-Eintrags per Event-Titel
export async function findEventId(eventId) {
    return await Event.findOne({_id: eventId}).populate('participants');
}

export async function getPreview() {
    return await Event.find({}).select('roll title beginning start');
}


// DB-Funktion zum Erstellen eines neuen Event-Eintrags
export async function insertNewEvent(eventBody) {
    try {
       
        // Erstelle neue Instanz des Event Models
        const newEvent = new Event(eventBody);

        // Speichere neue Instanz
        return await newEvent.save();

    } catch (error) {
        // Pruefe, ob Conflict durch Dupletten-Verletzung
        if ( (error.hasOwnProperty('code')) && (error.code === 11000) ) {
            // entsprechendes Fehlerobjekt wird gesendet
            throw {
                code: 409,
                message: error.message
            };

        } else {
            // Muss ein Validierungsproblem sein
            // entsprechendes Fehlerobjekt wird gesendet
            throw {
                code: 400,
                message: error.message
            };
        }
    }
}

// DB-Funktion zum Abrufen aller Event-Eintraege
export async function getAll() {
    return await Event.find().populate('participants');
}

export async function getEventsOfMonth(month) {
    // Konvertiert den Monat in eine Zahl und fügt ggf. eine führende Null hinzu wenn nötig
    let nextMonth = month+1;
    if(nextMonth === 13) nextMonth = 1
    if(nextMonth < 10) nextMonth = "0"+nextMonth;
    if(month < 10) month = "0"+month;

    // Sucht in der Datenbank nach Veranstaltungen, deren Beginn im angegebenen Monat liegt
    return await Event.find({
        "beginning": {"$gte": new Date(`2023-${month}-01T00:00:00.000Z`),
                "$lt": new Date(`2023-${nextMonth}-01T00:00:00.000Z`)}
    });
}

export async function modifyEvent(eventId, body) {
    return await Event.findByIdAndUpdate(eventId, body)
}

export async function deleteEvent(eventId) {
    return await Event.deleteOne({_id:eventId})
}

export async function attendToEventById(eventId, userId){
    let event = await findEventId(eventId);
    if(!event) throw new Error(`Event with ID: ${eventId} not found!`, {cause: 404})

    event.participants.push(userId);

    await addEventToUser(eventId, userId)

    await event.save();

    return await findEventId(eventId);
}

export async function cancelUserEvent(eventId, userId) {
    await Event.findOneAndUpdate({_id: eventId}, { $pull: { participants: userId } })
    await removeEventFromUser(eventId, userId);
}
