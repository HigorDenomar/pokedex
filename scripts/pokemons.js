let allPokemons;
let filter = '';
const maxPokemons = 150;

const html = {
  create: (tag) => document.createElement(tag),
  get: (tag) => document.querySelector(tag),
}

const getPokemonPromises = () => Array(maxPokemons).fill().map((_, index) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`).then(response => response.json());
});

function getPokemonData(pokemons) {
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

  allPokemons = listPokemons;
}

// shows pokémons on the screen
function render() {
  allPokemons.forEach((pokemon, id) => {
    if(pokemon.types.indexOf(filter) != -1 || filter == '') {
      let ul = html.get("ul");
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
      img.after(span);
      span.after(type);
    }
  });
}

// get all types of pokémons and add as select option
function getOptions() {
  let options = [];
  
  allPokemons.map(pokemon => {
    pokemon.types.map(type => {
      if(options.indexOf(type) === -1)
        options.push(type);
    })
  });

  let select = html.get("select#pokemon");

  options.map(type => {
    let option = html.create("option");
    option.value = type;
    option.innerHTML = type;

    select.append(option);
  });
}

function init() {
  const pokemonPromises = getPokemonPromises();

  // resolving promises
  Promise.all(pokemonPromises)
    .then(response => {
      getPokemonData(response);
      render();
      getOptions();
    })
    .catch(err => {
      alert('Ocorreu um erro inesperado :/\nTente novamente!');
      console.error(err);
    });

  // filter pokémons
  html.get("select#pokemon")
  .addEventListener("change", (event) => {
    filter = event.target.value;
    let ul = html.get("ul");
    ul.innerHTML = '';
    render();
  });
}

init();