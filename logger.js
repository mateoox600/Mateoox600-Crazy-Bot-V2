

module.exports = {

    logType: {
        INFO: {
            message: '[INFO] '
        },
        ERROR: {
            message: '[ERROR] '
        },
        WARNING: {
            message: '[WARNING] '
        }
    },

    /**
     * @param {{ message: string; }} type
     * @param {string} message
     */
    log: function(type, message){
        const dateNow = new Date();
        const dateNowText = '[' + dateNow.getDate() + '/' + (dateNow.getMonth()+1) + '/' + dateNow.getFullYear() + '] [' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + (dateNow.getSeconds()<10?'0'+dateNow.getSeconds():dateNow.getSeconds()) + '] ';
        console.log(dateNowText + type.message + message);
    }
}