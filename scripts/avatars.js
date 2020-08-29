const html = {
  create: (tag) => document.createElement(tag),
  get: (tag) => document.querySelector(tag),
}

const get = {
  url: (id) => `https://pokeapi.co/api/v2/pokemon/${id}`,
}

const ul = html.get("ul");


const getAllPokemons = () => Array(150).fill().map((_, index) => {
  return fetch(get.url(index + 1)).then(response => response.json());
});

const pokemonPromises = getAllPokemons();


function getPokemon(pokemons) {
  const listPokemons = pokemons.map(pokemon => {
    let name = pokemon.forms[0].name;
    let img = pokemon.sprites.front_default;
    let types = pokemon.types.map(type => type.type.name);

    return ({
      name,
      img,
      types
    });
  });

  return listPokemons;
}

function render(pokemons) {
  pokemons.forEach((pokemon, id) => {
    let li = html.create('li');
    let img = html.create('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id+1}.png`;
    
    li.classList.add(pokemon.types[0]);

    let span = html.create('span');
    span.innerHTML = pokemon.name;

    let type = html.create('p');
    type.innerHTML = pokemon.types.join(' | ');

    
    ul.append(li);
    li.append(img);
    img.after(span)
    span.after(type)

  });
}

function init() {
  Promise.all(pokemonPromises)
    .then(response => {
      const pokemon = getPokemon(response);
      render(pokemon);
    })
    .catch(err => {
      alert('Ocorreu um erro inesperado :/\nTente novamente!');
      console.error(err);
    });
}

init();







// for(let i = 1; i < 150; i++) {
//   let img = document.createElement('img');
//   img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
//   ul.append(img);
// }
