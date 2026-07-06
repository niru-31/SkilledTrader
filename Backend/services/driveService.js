const fs = require("fs");
const drive = require("../config/googleDrive");

const uploadFile = async (filePath, fileName) => {

const response = await drive.files.create({

    supportsAllDrives: true,

    requestBody: {

    name: fileName,

    parents: [
        process.env.GOOGLE_DRIVE_CERTIFICATE_FOLDER_ID
    ]

    },

    media: {

    mimeType: "application/pdf",

    body: fs.createReadStream(filePath)

    }

});

await drive.permissions.create({

    fileId: response.data.id,

    supportsAllDrives: true,

    requestBody: {

    role: "reader",

    type: "anyone"

    }

});

return {

    fileId: response.data.id,

    url:
    `https://drive.google.com/uc?id=${response.data.id}&export=download`

};

};

module.exports = {
uploadFile
};