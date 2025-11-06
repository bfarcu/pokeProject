/* This website will allow the user to input an ID number for a pokemon. Then through the poke api the page will be filled with cataloged information regarding the corresponding pokemon.
    It will also inculde a table for the moves (as it does), the sprite photo, along with the vocalizations. The current form uses the alert function, eventually I plan on moving that into a 
    search bar over the alert (though the alert for an improper input may still remain). Otherwise at it's current form it is close to completion minus a few other pieces of information to be included in the site,
    the next logical steps will be further refinment on the styling of the page it self. */
async function main() {
    function getIdNumber(){
        const fetchBtn = document.getElementById("fetchbtn");
        const input = document.getElementById("pokeId");

        fetchBtn.addEventListener("click", async () => {
            const pokeId = input.value.trim();
            if (!pokeId || pokeId > 1000) {
                alert("Please Enter a valid Poke-Dex ID.");
                return;
            }
            else {
                input.value = "";
            }
            await handleFetch(pokeId);
        });
    }
    getIdNumber();
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
    
    async function fetchPokemon(pokeId) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}/`);
        const pokeData = await response.json();
        console.log(pokeData);
        return pokeData;
    }


    function capFirstLetter(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    async function showPokemon(data){

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
        else if (data.habitat === "rare" || data.habitat === "Rare") {
            habElement.textContent = " Found very sparsely throughout various regions of the world.";
        }
        else if (data.habitat === null) {
            habElement.textContent = "Data Not Available";
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
        tableBody.innerHTML = "";

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
    // try catch block for fetch error
    async function handleFetch(pokeId) {
        try{
            const pokeData = await fetchPokemon(pokeId);
            const data = await fetchSpecies(pokeId);
            await showPokemon(data);
            await showNumId(pokeId);
            await showSprite(pokeData);
            await setDes(data);
            await showEvFrom(data);
            await showHabitat(data);
            await infoTable(data, pokeData);
            await showMoves(4, pokeData.moves);
        } catch (error) {
            console.log("Error in Fetching or handling data", error);
            alert("An error occurred while fetching the Pokemon data. Please try again.");
        }
    }
}
    // const heading = document.querySelector('h1');
    // heading.textContent = "input"
main();