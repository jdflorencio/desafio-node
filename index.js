const axios = require('axios');
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

// pegar uma lista de 20 pokemons com a api: https://pokeapi.co/api/v2/pokemon/
// para cada pokemon listado, coletar as informações dele em: https://pokeapi.co/api/v2/pokemon/:nome_pokemon
// Salvar os dados de cada pokemon da seguinte forma:
// name: string,
// base_experience: int,
// type: string,
// abilities: array

//retornar os dados em um array

let url = "https://pokeapi.co/api/v2/pokemon/";
const urlInfor = `https://pokeapi.co/api/v2/pokemon`
let base = []

async function informacoesPokemon(name) {
    let informacoesPokemons = await axios.get(`${urlInfor}/${name}`)
    return {
        base_experience: informacoesPokemons.data.base_experience,
        type: informacoesPokemons.data.types[0].type.name,
        abilities: informacoesPokemons.data.abilities.map((a) => a.ability.name),
    }
}

async function salveArquivos(data) {
    await fs.writeFile("pokemons.txt", data, function (error) {
        if (error) console.log('não pude salvar')
        console.log("Arquivo salvo");
    });
}

async function getSalvos() {
    try {

        return await readFileAsync("pokemons.txt", 'utf8')

    } catch (error) {
        console.log("nao foi possivel abri o arquivo", error)
    }
}

async function principal() {
    let pokemonsGet = await axios.get(url)

    for (p of pokemonsGet.data.results) {
        let pokemon = {
            name: p.name,
            ...await informacoesPokemon(p.name)
        }
        base.push(pokemon)
    }

    await salveArquivos(JSON.stringify(base, null, '\t'))
    console.log(await getSalvos())
}


principal()
