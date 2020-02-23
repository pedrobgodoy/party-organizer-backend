module.exports = {
    validateEmail(mail) 
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
            return true;
        }
        return false;
    },
    parseHeaderAuthorization(headers){
        const authorization = headers.authorization;
        if(!authorization) throw new Error("Cabeçalho vazio");

        const [, encodedData] = authorization.split(' ');
        return new Buffer.from(encodedData, 'base64').toString().split(':');
    },
    parseDate(dateString){
        const dateArray = dateString.split('/');
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0] + 'T00:00');
    }
}