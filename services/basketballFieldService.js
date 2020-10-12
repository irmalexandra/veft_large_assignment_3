const axios = require('axios');
const basketBallFieldUri = "https://basketball-fields.herokuapp.com/api/basketball-fields";


async function allBasketballFields(){
    const fields = await axios.get(basketBallFieldUri);
    return fields["data"]
}

async function getBasketballFieldById(parent, args){
    let field;
    if (args.id){
        field = await axios.get(basketBallFieldUri+"/"+args.id);
    }
    else{
        field = await axios.get(basketBallFieldUri+"/"+args);
    }
    return field["data"]
}

module.exports = {
    allBasketballFields: allBasketballFields,
    getBasketballFieldById: getBasketballFieldById
}