import moment from "moment";
import fs from "fs";
import constants from "../../constants.js";

/**
 *
 * @param {*} error -> ERROR
 *
 * Gets error passed to the logger and logs internal server errors
 */
const logger = async (error) => {
    const date = new Date();

    // create a new file for each day
    const fileName = `${moment(date).format("YYYY-MM-DD")}.log`;
    const file = `${constants.LOGS.FILE_PATH}/${fileName}`;

    // error content
    const content = `${new Date().toISOString()} | ${error?.message}\n`;

    // create a dir if does not exist
    fs.mkdir(constants.LOGS.FILE_PATH, { recursive: true }, (err) => {
        if (err) console.error(err);
    });

    // Append to file
    fs.appendFile(file, content, (err) => {
        if (err) {
            console.error(err);
        }
    });
};

export default { logger };
