const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const modal = document.getElementById("myModal"); // Get the modal
const modalBody = modal.getElementsByClassName("modal-body")[0];
const modalHeader = document.getElementsByClassName("modal-header")[0];
const modalFooter = document.getElementsByClassName("modal-footer")[0];
const span = document.getElementsByClassName("modal-close")[0]; // Get the <span> element that closes the modal
const modalTitle = document.getElementsByClassName("modal-title")[0];

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemons.forEach((pokemon) => {
      const li = htmlToElement(convertPokemonToLi(pokemon));
      li.addEventListener("click", () => {
        modal.style.display = "flex";
        modalHeader.className = "modal-header " + pokemon.type;
        modalFooter.className = "modal-footer " + pokemon.type;
        modalBody.innerHTML = `<img src="${pokemon.photo}" alt="pokemon photo" style="max-height:15rem; margin:1rem 2rem;" />`;
        modalBody.innerHTML += `
        <div>
            <button class="tablink" onclick="openPage('pokemon-stats', this)" id="defaultOpen">Stats</button>
            <button class="tablink" onclick="openPage('pokemon-abilities', this)">Abilities</button>
        
            <div id="pokemon-stats" class="tabcontent">
                <table id="stat-table">
                    <tr><td>HP</td><td>${pokemon.hp}</td></tr>
                    <tr><td>ATK</td><td>${pokemon.attack}</td></tr>
                    <tr><td>DEF</td><td>${pokemon.defense}</td></tr>
                    <tr><td>S. ATK</td><td>${pokemon.specialAttack}</td></tr>
                    <tr><td>S. DEF</td><td>${pokemon.specialDefense}</td></tr>
                    <tr><td>SPEED</td><td>${pokemon.speed}</td></tr>
                </table>
            </div>

            <div id="pokemon-abilities" class="tabcontent">
                <ol>
                    ${pokemon.abilities
                      .map((ability) => "<li>" + ability + "</li>")
                      .join("")}
                </ol>
            </div>
        </div>`;
        modalTitle.innerHTML = pokemon.name;

        document.getElementById("defaultOpen").click();
      });
      pokemonList.appendChild(li);
    });
  });
}

// carrega os primeiros pokemons
loadPokemonItens(offset, limit);

// carrega mais pokemons
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// abrir abas dos detalhes
function openPage(pageName, elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
    tablinks[i].style.color = "#999";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = "#faf0f0";
  elmnt.style.color = "black";
}
