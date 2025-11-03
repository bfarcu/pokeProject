/* This website will allow the user to input an ID number for a pokemon. Then through the poke api the page will be filled with cataloged information regarding the corresponding pokemon.
    It will also inculde a table for the moves (as it does), the sprite photo, along with the vocalizations. The current form uses the alert function, eventually I plan on moving that into a 
    search bar over the alert (though the alert for an improper input may still remain). Otherwise at it's current form it is close to completion minus a few other pieces of information to be included in the site,
    the next logical steps will be further refinment on the styling of the page it self. */
async function main() {
    function getIdNumber(){
        let id = prompt ("Please Enter a Pokemon ID number: ");
        if (id > 1000) {
            alert("ID number is too high, Please try again.");
           let id = prompt ("Please Enter a VALID Pokemon ID number: ");
              return id;
        }
        else 
            return id;
    }
    
    const pokeId = getIdNumber();
//fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeId}/`) //use the back hash, not hyphon
//  .then(response => response.json())
  //.then(data => {
   //   console.log(data);
   //   return data;
 //})
 //   .catch(error => {
  //     console.log("Error in Fetching data", error);
 // });

    async function fetchSpecies(pokeId) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeId}/`);
        const data = await response.json();
        console.log(data);
        return data;
        }
    
    async function fetchPokemon() {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}/`);
        const pokeData = await response.json();
        console.log(pokeData);
        return pokeData;
    }

    const pokeData = await fetchPokemon();
    const moves = pokeData.moves;

    function capFirstLetter(name = data.name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    async function showPokemon(pokeId){
        const data = await fetchSpecies(pokeId);

        const nameElement = document.getElementById("pokeName");

        nameElement.textContent = capFirstLetter(data.name);

        return data;
    }

    async function showNumId(pokeId){
        const idElement = document.getElementById("idNum");
        idElement.textContent = `#${pokeId}`
        return pokeId;
    }

    async function showSprite(pokeData){
        const spriteElement = document.getElementById("sprite");
        spriteElement.src = pokeData.sprites.front_default;
        return pokeData;
    }

    async function setDes(data) {
        const entry = data.flavor_text_entries.find(
            item => item.language.name === "en"
         )
       const rawTxt =entry ? entry.flavor_text : "Description not available.";
       const cleanText = rawTxt.replace(/[\n\u000c]/g, " ");
       const flavorElement = document.getElementById("flavorTxt");
       flavorElement.textContent = cleanText;
       return data;
    }

    async function showEvFrom(data) {
        const evolveElement = document.getElementById("evlolvesFrom");
        if (data.evolves_from_species === null) {
            evolveElement.textContent = "None Available";
        }
        else {
            evolveElement.textContent = capFirstLetter(data.evolves_from_species.name);
        }
        return data;
    }

    async function showHabitat(data) {
        const habElement = document.getElementById("habData");
        if (pokeId === "150") {
            habElement.textContent = " This Creature was created by science in a lab, in an effort to create the ultimate Pokemon. Only one is known to exist.";
            return data;
        }
        else if (data.habitat.name === "rare") {
            habElement.textContent = " Found throughout the world, but seen in low numbers.";
        }
        else {
            habElement.textContent = capFirstLetter(data.habitat.name);
        }
        return data;
    }

    async function infoTable(data, pokeData) {
        const baseExp = document.getElementById("baseExp");
        const capRate = document.getElementById("captureRate");
        const hatchCounter = document.getElementById("hatchCounter");
        const happiness = document.getElementById("baseHappiness");
        const baby = document.getElementById("isBaby");
        const legend = document.getElementById("isLegendary");
        const mythical = document.getElementById("isMythical");

        baseExp.textContent = pokeData.base_experience;
        capRate.textContent = data.capture_rate;
        hatchCounter.textContent = data.hatch_counter;
        happiness.textContent = data.base_happiness;
        baby.textContent = data.is_baby ? "Yes" : "No";
        legend.textContent = data.is_legendary ? "Yes" : "No";
        mythical.textContent = data.is_mythical ? "Yes" : "No";
        return data, pokeData;
    }
    
        //this function created with the help of AI
    async function showMoves(columns = 4, moves){
        const tableBody = document.getElementById('moveTableBody');

        const rows = Math.ceil(moves.length / columns);

        for (let r = 0; r < rows; r++) {
            const row = document.createElement('tr');
        
            for (let c = 0; c < columns; c++){
                const index = r + c * rows;
                const cell = document.createElement('td');
        
                if (index < moves.length) {
                    cell.textContent = moves[index].move.name;
                }
        row.appendChild(cell);
            }
        tableBody.appendChild(row);
        }
    }

  
    
    const data = await showPokemon(pokeId);
    await setDes(data);
    await showMoves(4, moves);
    await showEvFrom(data);
    await showSprite(pokeData);
    await showNumId(pokeId);
    await infoTable(data, pokeData);
    await showHabitat(data);
}
    // const heading = document.querySelector('h1');
    // heading.textContent = "input"
main();