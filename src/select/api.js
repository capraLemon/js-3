async function apiGetCities(name) {
    let result = [];
    try {
        const response = await fetch(`https://api.hh.ru/suggests/areas?text=${name}`);
        const myJson = await response.json();
        myJson.items.forEach(item => result.push(item.text));
        return result;
    }
    catch (err) {
        return console.log(err);
    }
}

export { apiGetCities };