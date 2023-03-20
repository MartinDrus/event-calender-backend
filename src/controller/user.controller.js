import * as UserModel from "../model/user.model.js";
import { findById, findByName } from "../model/role.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import sendVerificationEmail from '../service/mailVerification.js';
import { generateJsonWebToken } from "../service/jwt/jwt.generateToken.js";
import md5 from 'md5';

// Controller Funktion zum Anlegen neuer User
export async function registerNewUser(req, res) {
    let body = req.body;

    // Generating a random String
    const salt = await bcrypt.genSalt(10);
    // Hashing the String
    const verificationToken = md5(salt);
    // Including Token to User DB
    body.verificationHash = verificationToken;

    // Overwriting password-Property with its Hash
    body.password = bcrypt.hashSync(body.password, 10);

    try {
        // Calling Model-Function for inserting a new User
        let user = await UserModel.insertNewUser(body);
        
        // Suche Rolle des Nutzers anhand der ID
        const userRole = await findByName('unverified');

        // Setze Ablaufzeit für das Token auf 3 Stunden
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const duration = hour;

        // Payload mit den Nutzerdaten für das Token
        let payload = {
            id: user._id,
            name: user.username,
            role: userRole.name
        }

        // Erstelle Token mit den Nutzerdaten
        const token = generateJsonWebToken(payload, duration);

        // Sending mail 
        sendVerificationEmail(body.email, verificationToken)

        // Konfiguration für das Cookie
        let options = {
            httpOnly: true,
            expires: new Date(Date.now() + duration)
        }

        // Setze Cookie mit Token
        res.cookie('access_token', `Bearer ${token}`, options).send({
            success: true,
            message: `"Registration successful - Please check your Mails "`,
        })

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function getUserEvents(req, res) {
    const userId = req.tokenPayload.id;

    try {
        let user = await UserModel.findUserEventsByUserId(userId)
        res.send(user);

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }

}

// Funktion zum Einloggen eines Nutzers
export async function loginUser(req, res, next) {
    let {login, password} = req.body;

    try {
        // Suche User per Username -> Falls nicht gefunden per Mail
        let user = await UserModel.findUserByUsername(login);
        if (!user) {
            user = await UserModel.findUserByMail(login);
            if (!user) throw new Error("invalid username or password", {cause: 409}) 
        }
        // Überprüfe, ob das Passwort korrekt ist
        const passwordMatches = bcrypt.compareSync(password, user.password);

        if (passwordMatches) {

            // Suche Rolle des Nutzers anhand der ID
            const userRole = await findById(user.role);

            // Setze Ablaufzeit für das Token auf 3 Stunden
            const minute = 60 * 1000;
            const hour = 60 * minute;
            const duration = 3 * hour;

            // Payload mit den Nutzerdaten für das Token
            let payload = {
                id: user._id,
                name: user.username,
                role: userRole.name
            }

            // Erstelle Token mit den Nutzerdaten
            const token = generateJsonWebToken(payload, duration);

            // Konfiguration für das Cookie
            let options = {
                httpOnly: true,
                expires: new Date(Date.now() + duration)
            }

            // Setze Cookie mit Token
            res.cookie('access_token', `Bearer ${token}`, options).send({
                success: true,
                message: `User ${user.username} logged in successfully!`,
            })

        } else throw new Error("invalid username or password", {cause: 409}) 

    } catch (error) {
        // Fehlerbehandlung
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function logout(req, res) {

    try {
        res.clearCookie('access_token');
        res.send({success: true, message: 'Logged out successfully'});

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

// Funktion zum Aktualisieren eines Benutzers (ADMIN only)
export async function updateUser(req, res){
    let userId = req.params.id
    let body = req.body;

    switch (body.role) {
        case "admin":
            body.role = "6405ac7d6b2564cd76c42603"
            break;
        case "author":
            body.role = "6405ac7d6b2564cd76c42604"
            break;
        case "user":
            body.role = "6405ac7d6b2564cd76c42605"
            break;
        default:
            break;
    }

    try {
        // Benutzer aktualisieren
        let response = await UserModel.modifyUser(userId, body)
        res.send(response)
        
    } catch (error) {
        // Fehlerbehandlung
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


export async function editOwnProfile(req, res) {

    const userId = req.tokenPayload.userId;
    let body = req.body;

    let newBody = {
        username: body.username,
        fullname: body.fullname,
        password: body.password,
        city: body.city
    }

    try {

        let response = await UserModel.modifyUser(userId, newBody)
        res.send(response)
        
    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

// Verifiziert die E-Mail-Adresse eines Benutzers anhand des übergebenen Tokens
export async function verifyEmail(req, res, next) {
    const emailToken = req.query.t;

    try {

        await UserModel.verifyUser(emailToken);
        res.redirect('https://event-calender-react.vercel.app/login');

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }

}

export async function refreshNewVerification(req, res, next) {
    //todo
    const jwtPayload = req.tokenPayload;
    console.log("🚀 ~ file: user.controller.js:170 ~ refreshNewVerification ~ jwtPayload:", jwtPayload)

}

//delete User
export async function deleteUserById(req, res) {
    let id = req.params.id;

    try {
        res.send(await UserModel.deleteUserById(id));

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


export async function getAllUsers(req, res) {
    res.send(await UserModel.getAll());
}






