
function checkRole(req, res, next) {
    const jwtPayload = req.tokenPayload;
    if(jwtPayload && jwtPayload.role === 'unverified') return res.send({success: false, message: jwtPayload.role})
    else res.send({success: true, message: jwtPayload.role})

    next();
}

export default checkRole;