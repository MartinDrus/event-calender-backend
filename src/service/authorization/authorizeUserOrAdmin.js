import { rolesEnum } from "../../model/role.model.js";

// Middleware-Funktion zum Authorisieren der admins
function authorizeUserOrAdmin(req, res, next) {
    const jwtPayload = req.tokenPayload;

    if (jwtPayload.role === rolesEnum.admin || jwtPayload.role === rolesEnum.user) {
        next();
    } else {
        res.status(401).send({
            success: false,
            message: `Role ${jwtPayload.role} is not authorized for the endpoint`
        });
        return;
    }

}

export default authorizeUserOrAdmin;