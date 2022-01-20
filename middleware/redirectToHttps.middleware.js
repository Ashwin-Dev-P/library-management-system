module.exports = function redirectToHttpsRequest(req, res, next) {
    //Redirect http to https protocol
    if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
    else
        next()

}