# Kalender API Server

Das Backend Projekt für eine Kalender-Event-App.
User sollen die Möglichkeit haben sich zu registrieren, einzuloggen und an Events teil zu nehmen. Events sollen in einem privaten bzw. öffentlichen Kalender einsehbar sein.

## Installierte HAUPT Packete

- express
- express-validator
- mongoDB
- mongoose
- cors


## API Endpunkte

- **POST** (ADMIN) http://localhost:8080/protected/events - Erstelle ein neues Event (ready)

- **POST** http://localhost:8080/auth/register - Um einen neuen User zu registrieren (ready)
- **POST** http://localhost:8080/auth/login - Um einen User einzuloggen (ready *)

- **GET** http://localhost:8080/auth/events - Um alle Events zu fetchen (ready)
- **GET** http://localhost:8080/auth/events/:month - (1-12) Um Events eines Monats zu fetchen (ready)
- **GET** http://localhost:8080/auth/events/now - Um Events des aktuellen Monats zu fetchen (ready)

- **PATCH** (USER) http://localhost:8080/auth/events/attend/:eventId - Um an einem Event teil zu nehmen

- **PATCH** (ADMIN) http://localhost:8080/protected/user/:userId - Um Daten eines bestimmten Users zu ändern (ready)
- **PATCH** (ADMIN) http://localhost:8080/protected/events/:eventId - Um Daten eines bestimmten Events zu ändern (ready)

- **DEL** (ADMIN) http://localhost:8080/protected/user/:userId  - Um einen User zu entfernen
- **DEL** (ADMIN) http://localhost:8080/protected/events/:eventId - Um einen Event zu entfernen (ready)

*cookies aktivieren

## Daten Schemata

User:
```
"username": "Max",
"email": "max@muster.com",
"password": "String",
"role": "admin",
"admin": "true",
"events": [
    "event ID",
    "event ID",
    "event ID"
]

```

Event:
```
"title": "Cook with Claus",
"beginning": "Date",
"duration": "Date",
"description": "Super nice italian pasta food event",
"participant": [
    "user ID",
    "user ID",
    "user ID"
],
"attending": 20

```

Rolle:
```
"name": "User",

```

## TODOS

1. route that a user can attend to an event
2. refreshNewVerification
3. [x] modify event
4. [x] delete event
5. [x] Token gültigkeit prüfen
6. testen





