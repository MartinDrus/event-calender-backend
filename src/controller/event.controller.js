import * as EventModel from "../model/event.model.js";

export async function registerNewEvent(req, res) {
    let body = req.body;

    try {
        // Die "insertNewEvent"-Funktion in "EventModel" wird aufgerufen, um ein neues Event zu erstellen
        let response = await EventModel.insertNewEvent(body);

        // Die aktualisierten Daten werden als Antwort an den Client gesendet
        res.send(response)
        
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function getAllEvents(req, res) {
    try {
        let response = await EventModel.getAll();
        // Alle Events werden als Antwort an den Client gesendet
        res.send(response)
        
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function getEventById(req, res) {
    let eventId = req.params.id
    try {
        let response = await EventModel.findEventId(eventId);
        // Alle Events werden als Antwort an den Client gesendet
        res.send(response)
        
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function getEventPreview(req, res) {
    try {
        let response = await EventModel.getPreview();
        // Alle Events werden als Antwort an den Client gesendet
        res.send(response)
        
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}



export async function getEventsOfMonth(req, res) {
    // Extrahiere den Monat aus dem URL Parameter und speichere ihn in der Variable "month"
    let month = parseInt(req.params.month)
    // Falls kein Monat im URL Parameter enthalten ist, wird der aktuelle Monat verwendet
    if (!month) month = new Date().getMonth()+1;

    try {
        if(month < 1 || month > 12) throw new Error('Invalid month', {cause: 400})
        let response = await EventModel.getEventsOfMonth(month);
        // Alle Events werden als Antwort an den Client gesendet
        res.send(response)
        
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function updateEvent(req, res){
    let eventId = req.params.id
    let body = req.body;
    
    try {
        // Die "modifyEvent"-Funktion in "EventModel" wird aufgerufen, um das Ereignis zu aktualisieren
        let response = await EventModel.modifyEvent(eventId, body)
        console.log("🚀 ~ file: event.controller.js:24 ~ updateEvent ~ response:", response)
    
        // Die aktualisierten Daten werden als Antwort an den Client gesendet
        res.send(response)
        
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function deleteEventById(req, res) {
    let id = req.params.id;

    try {
        let response = await EventModel.deleteEvent(id)
        console.log("🚀 ~ file: event.controller.js:41 ~ deleteEventById ~ response:", response)
        res.send(response);

    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function attendToEvent(req, res) {
    const userId = req.tokenPayload.id;
    const eventId = req.params.id;

    try {
        await EventModel.attendToEventById(eventId, userId)
        res.send({success: true});
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }

}

export async function cancelUserEvent(req, res) {
    const userId = req.tokenPayload.id;
    const eventId = req.params.id;

    try {
        await EventModel.cancelUserEvent(eventId, userId)
        res.send({success: true});
    } catch (error) {
        // Wenn ein Fehler auftritt, wird eine entsprechende Fehlermeldung an den Client gesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }

}