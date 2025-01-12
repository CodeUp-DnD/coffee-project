(function(){
    // Smith - turned into IIFE here.
    //  From https://java.codeup.com/javascript-i/functions/:
    //  "From this point forward, you should enclose all of your javascript code
    //  inside of an iife (including function definitions). Doing this protects
    //  our code from being exposed to the global scope."

    //  I also changed any vars to lets so we only have to worry about block-scope {}

    "use strict"
const renderCoffee = (coffee) => {
    //Old Code
    // var html = '<tr class="coffee">';
    // html += '<td>' + coffee.id + '</td>';
    // html += '<td>' + coffee.name + '</td>';
    // html += '<td>' + coffee.roast + '</td>';
    // html += '</tr>';

    //New Code
    let html = `<div class="coffee" id="coffee_${coffee.id}">`
    html += `<h3 id='${coffee.id + '_name'}'>${coffee.name}</h3>`
    html += `<p id='${coffee.id + '_roast'}'>${coffee.roast}</p>`
    html += '</div>'
    
    return html;
}

const renderCoffees = (coffees) => {
    //VIGO: Ticket #2 - When the page loads, the coffees should be sorted by their ids in ascending order
    coffees.sort((a,b)=>a.id < b.id ? 0 : -1); //Sort by id in asc order

    let htmlCol1 = '<div class="col-sm-6 col-md-6">';//Smith - Left column
    let htmlCol2 = '<div class="col-sm-6 col-md-6">';//Smith - Right column
    for(let i = coffees.length - 1; i >= 0; i--) {
        if (i % 2 == 0) {
            htmlCol1 += renderCoffee(coffees[i]);
        } else {
            htmlCol2 += renderCoffee(coffees[i]);
        }
    }
    htmlCol1 += '</div>';
    htmlCol2 += '</div>';
    let finalHtml = '<div class="row">' + htmlCol1 + htmlCol2 + '</div>';  //Smith - mash columns into one html
    return finalHtml;
}

const updateCoffees = (e) => {
    /*
        Vigo - Ticket #3 - Initially we will call
        this function without an event in order
        to render out the coffees with any existing
        search filters. So we need to check for the event
        before preventing the default behavior.
    */    
    if(e){ //Only if there's an event available
        e.preventDefault(); // don't submit the form, we just want to update the data
    }

    //Vigo - Ticket #3
    //Pull the selected roast directly from localStorage
    //OLD CODE
    // var selectedRoast = roastSelection.value;
    //NEW CODE
    let selectedRoast = localStorage.getItem('roast_selection');

    //Check if there is a selected roast in local storage first
    if(!selectedRoast){ //If there's not
        localStorage.setItem('roast_selection','all roasts') //Set the roast in the local storage variable
        selectedRoast = 'all roasts' //and the local version
    } //rock on.

    console.log(selectedRoast)

    //Check for the selected roast    
    let filteredCoffees = [];
    coffees.forEach(function(coffee) {
        //OLD CODE
        // if (coffee.roast === selectedRoast) {
        //     filteredCoffees.push(coffee);
        // }

        //NEW CODE
        /*
            Vigo - Ticket #3 - Now let's check
            against our stored search term and
            filter the list further by the coffee's 
            name and the selected roast type
        */
        let searchTerm = localStorage.getItem('search_term')

        //If the search term includes the name of the coffee
        if(coffee.roast === selectedRoast || selectedRoast === 'all roasts'){  //Vigo - Ticket 6 - Filter all roasts option
            //If the roast matches
            //Add there's a search term available
            if(searchTerm){ 
                //And it includes the name of the coffee
                /*
                    This can be improved by using
                    string comparison algorithms like
                    1. Levenshtein distance algorithm
                    2. Jaro-Winkler text distance algorithm
                    3. Sorensen Dice algorithm
                    4. Jaccard index algorithm
                    etc..

                    we'll leave it for now

                */
                /*
                    Vigo - Ticket #5 - Make search case insensitive
                */
                if(searchTerm.toLowerCase().includes(coffee.name.toLowerCase())){
                    //Add it to the list
                    filteredCoffees.push(coffee)
                }
            }else{ //Otherwise just sort by roast type
                filteredCoffees.push(coffee)
            }
        }
    });



    tbody.innerHTML = renderCoffees(filteredCoffees);
}

// from http://www.ncausa.org/About-Coffee/Coffee-Roasts-Guide
/*
    Vigo - Ticket #7 - Save coffees to localStorage
*/
let default_coffees = [
    {id: 1, name: 'Light City', roast: 'light'},
    {id: 2, name: 'Half City', roast: 'light'},
    {id: 3, name: 'Cinnamon', roast: 'light'},
    {id: 4, name: 'City', roast: 'medium'},
    {id: 5, name: 'American', roast: 'medium'},
    {id: 6, name: 'Breakfast', roast: 'medium'},
    {id: 7, name: 'High', roast: 'dark'},
    {id: 8, name: 'Continental', roast: 'dark'},
    {id: 9, name: 'New Orleans', roast: 'dark'},
    {id: 10, name: 'European', roast: 'dark'},
    {id: 11, name: 'Espresso', roast: 'dark'},
    {id: 12, name: 'Viennese', roast: 'dark'},
    {id: 13, name: 'Italian', roast: 'dark'},
    {id: 14, name: 'French', roast: 'dark'},
    {id: 15, name: 'Cowboy Coffee', roast: 'dark'},
    {id: 16, name: 'Unicorn Piss', roast: 'light'},
    {id: 17, name: 'JP-10', roast: 'medium'},
]

let coffees = [
   
];

let localStorageCoffees = JSON.parse(localStorage.getItem('coffees'))
console.log(localStorageCoffees)

if(!localStorageCoffees){
    coffees = default_coffees
    localStorage.setItem('coffees',JSON.stringify(coffees))
}else{
    coffees = localStorageCoffees
}



let tbody = document.querySelector('#coffees');
let submitButton = document.querySelector('#submit');
let roastSelection = document.querySelector('#roast-selection');

//Vigo - Ticket #3/4
//If there is a roast selection stored in the localStorage
//Set the value of the roast select to that value
roastSelection.value = localStorage.getItem('roast_selection')
/*
    Vigo - Ticket #4
    Adding event listener to the roast select
    so we can update the coffee list dynamically
    as soon as they make a selection
*/
roastSelection.addEventListener('change',e=>{
    localStorage.setItem('roast_selection',e.target.value)
    console.log(e.target.value)
    updateCoffees(e)
})

//Vigo - Ticket #3 
/*
    Instead of automatically rendering the entire 
    coffee list, check if there are search filters
    available in the localStorage, apply them before
    rendering, this is already being done inside the 
    updateCoffees function, so we can just call that
    since it contains a final call to renderCoffees
*/
//OLD CODE
// tbody.innerHTML = renderCoffees(coffees);
//NEW CODE
updateCoffees()

submitButton.addEventListener('click', updateCoffees);


/*
    VIGO - Ticket #3 - Add functionality to search through the coffees by name, 
    and display only the coffees that match the provided search term 
    (You will need to add an input field to the existing form for this)
*/
const searchInput = document.querySelector('#search_input')
searchInput.value = localStorage.getItem('search_term')
let searchTerm = null

/*
    VIGO - Ticket #4 - Add functionality to update the 
    displayed coffee as the user types into the search 
    box, or as soon as they select an option from the select.
*/
searchInput.addEventListener('keyup',(e)=>{
    //Store the search term in localStorage so we can access it inside the update function
    localStorage.setItem('search_term',e.target.value)
    //Update the coffee list based on the new search term
    updateCoffees(e)
})


//VIGO : Ticket #7 - Adding New Items
let newRoastSelection = document.querySelector('#new_roast_selection')
let submitNewCoffee = document.querySelector('#submit_new')
let newCoffeeName = document.querySelector('#new_coffee_name_input')
submitNewCoffee.addEventListener('click',(e)=>{
    e.preventDefault()
    let roast = newRoastSelection.value
    let name = newCoffeeName.value
    let id = coffees.length + 1
    let newCofee = {
        id,
        name,
        roast
    }
    coffees.push(newCofee)
    localStorage.setItem('coffees',JSON.stringify(coffees))
    newCoffeeName.value = ''
    updateCoffees()
})

}());
