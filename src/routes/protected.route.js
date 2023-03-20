import { Router } from "express";
import { validationResult } from 'express-validator';
import { deleteEventById, registerNewEvent, updateEvent } from "../controller/event.controller.js";
import { getAllUsers, updateUser } from "../controller/user.controller.js";
import authorizeAdmin from "../service/authorization/authorizeAdmin.js";
import verifyToken from "../service/jwt/jwt.verifyToken.js";
import { eventValidationMiddleware } from "../service/validation/eventValidationSchema.js";

// Benutzerdefinierte Middleware, um Validierungsfehler zu behandeln
function myRouteHandler(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Wenn Validierungsfehler auftreten, senden Sie eine 400-Antwort mit einer Fehlermeldung
    }
    next(); // Wenn keine Validierungsfehler auftreten, rufen Sie die nächste Middleware in der Kette auf
}


// Erstelle neue Router Instanz
const protectedRouter = Router();

// Setze Tokenverifizierungs-Middleware fuer alle Endpoints des Routers
//todo insert TokenVerification (use browser)
protectedRouter.use(verifyToken, authorizeAdmin);

//!-----USERS-----

// Routen Definition fuer root
protectedRouter.route('/user')
    .get(getAllUsers)

// Routen Definition fuer root
protectedRouter.route('/user/:id')
    .patch(updateUser)

//!-----EVENTS-----

protectedRouter.route('/events')
    .post([eventValidationMiddleware, myRouteHandler], registerNewEvent);

protectedRouter.route('/events/:id')
    .patch(updateEvent)
    .delete(deleteEventById)

protectedRouter.route('/test').get((req,res) => {
    res.send({
        success: true,
        data: req.tokenPayload
    });
})


export default protectedRouter;