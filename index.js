const request = require('request')//.defaults({ 'proxy':'http://proxy.lsy.bud.dlh.de:3128' })
const fs = require('fs')
const apiURL = 'http://floogle-web-staging.herokuapp.com/sync/resource'
const formatJSON = require('format-json')
const config = require('./config/config')
const base64 = require('node-base64-image').base64encoder
const headers = {
        "content-type" : "application/json",
        "authorization" : "Bearer d07CSXHXGlV5Upk4JwWsTtmmzbdzF6HPM1SOHfKf2yD5VOklFhTck1tNFG7FfYnfDmQLtxgGBSm8Kzr5cznvG8fQD4TFjiraYAs7q1QucHdxzpqjLXb9n6MYUU13ZEFtpC8FfQM3sAWfIDW8i664niuiY0IgeZx3a6OKGPepSTkLLRVf5UXgz55XDyn5mV0T9ymDKxbubMz13QPMYcF0pTYi7nazIWpACmJt6ADt29xLpRtvEFgFaaFZbdM0NdRI"
}

const folder = './cities'

fs.readdir(folder, (err, files) => {
    if (err) {
        config.logger.debug('Could not list the directory: ', err)
        process.exit(1)
    }

    files.forEach((file, index) => {
        const path = `./cities/${file}`
        const fsOptions = {
            localFile: true,
            string: true
        }
        const mediaJSON = {
            media : {
                id : file.substring(0,file.indexOf('.')),
                mime : 'image/jpg',
                name : file,
                payload : ''
            }
        }

        function encodeImage() {
            return new Promise((resolve, reject) => {
                base64(path, fsOptions, (err, image) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(image)
                })
            })
        }
        const encodedImage = encodeImage()

        encodedImage.then((base64image) => {
            mediaJSON.media.payload = base64image
            headers['content-length'] = Buffer.byteLength(base64image)
        }).then(() => {
            config.logger.debug(`mediaJSON content: ${mediaJSON.media.payload.slice(-10)}`)
            request({
              method: 'PUT',
              url: apiURL,
              headers: headers,
              json: mediaJSON
            }, (err, res, body) => {
                  if (!err && res.statusCode == 200) {
                      config.logger.debug(`${mediaJSON.media.name} has been uploaded!`)
                  } else {
                      config.logger.debug(err)
                  }
            })
        })
      })
})
