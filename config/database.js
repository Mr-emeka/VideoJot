if (process.env.NODE_ENV === "production") {
    module.exports = {
        MongoURI:'mongodb://mr_emeka:trumpet123@ds163650.mlab.com:63650/vidprod',
        
    }
} else {
    module.exports = {
        MongoURI:'mongodb://mr_emeka:trumpet123@ds263460.mlab.com:63460/videojot-dev'
    }
}