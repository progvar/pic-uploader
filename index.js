const request = require('request')
const fs = require('fs')
const apiURL = ''
const config = require('./config/config')
const base64 = require('node-base64-image').base64encoder
const headers = {
        'content-type' : 'application/json',
        'authorization' : 'Bearer '
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
            string: true,
            autoClose: true
        }
        const mediaJSON = {
            media : {
                id : file.substring(0, file.search(/\d/)),
                mime : 'image/jpg',
                name : `${file.substring(0, file.search(/\d/))}.jpg`,
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

        encodedImage.then(base64image => {
            mediaJSON.media.payload = base64image
            config.logger.debug(`mediaJSON content: ${mediaJSON.media.payload.slice(-10)}`)
            request({
              method: 'PUT',
              url: apiURL,
              headers: headers,
              json: mediaJSON
            }, (err, res, body) => {
                  config.logger.debug(res.statusCode)
                  if (!err && res.statusCode == 200) {
                      config.logger.debug(`${mediaJSON.media.name} has been uploaded!`)
                  } else {
                      config.logger.debug(err)
                  }
            })
        })
      })
})
