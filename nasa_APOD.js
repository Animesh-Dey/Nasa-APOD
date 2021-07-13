const resultnav = document.getElementById("resultsnav");
const favoritesnav = document.getElementById("favoritesNav");
const imagescontainer = document.querySelector(".images-container");
const saveconfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

//NASA API
const count = 10;
const apikey = "fhyoTCQ6YKkkCj7gEiKCHjBNeLq4iMOCR54163ZI";
const apiurl = `https://api.nasa.gov/planetary/apod?api_key=${apikey}&count=${count}`;

let resultarray = [];
let fav = {};

function showcontent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if(page==='results')
  {
      resultsNav.classList.remove('hidden');
      favoritesnav.classList.add('hidden');
  }
  else
  {
    resultsNav.classList.add('hidden');
    favoritesnav.classList.remove('hidden');
  }
  loader.classList.add("hidden");
}

function createdomnodes(page) {
  const currentarray = page === "results" ? resultarray : Object.values(fav);
  //console.log('current array : ',page,currentarray);
  currentarray.forEach((result) => {
    //card container
    //card
    const card = document.createElement("div");
    card.classList.add("card");
    //link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View full image";
    link.target = "_blank";
    //img
    const img = document.createElement("img");
    img.src = result.url;
    img.alt = "NASA Picture of the day";
    img.loading = "lazy";
    img.classList.add("card-img-top"); //card-img-top is present in css files
    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    //saveText.textContent='ADD TO FAV';
    //saveText.setAttribute('onclick',`saveFav('${result.url}')`);
    if (page === "results") {
      saveText.textContent = "ADD TO FAV";
      saveText.setAttribute("onclick", `saveFav('${result.url}')`);
    } else {
      saveText.textContent = "REMOVE TO FAV";
      saveText.setAttribute("onclick", `removeFav('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(img);
    card.append(link, cardBody);
    imagescontainer.appendChild(card);
  });
}

function updatedom(page) {
  //get fav from local storage
  if (localStorage.getItem("nasaFavorities")) {
    fav = JSON.parse(localStorage.getItem("nasaFavorities"));
    //console.log(fav);
  }
  imagescontainer.textContent = "";
  createdomnodes(page);
  //show loader
  showcontent(page);
}
//get 10 images from NASA API
async function getnasapictures() {
  //show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiurl);
    resultarray = await response.json();
    //console.log(resultarray);
    updatedom("results");
  } catch (error) {
    //Catch error here
  }
}

//add result to fav
function saveFav(itemurl) {
  // console.log(itemurl);
  //loop through results array to select fav
  resultarray.forEach((item) => {
    if (item.url.includes(itemurl) && !fav[itemurl]) {
      fav[itemurl] = item;
      //console.log(fav);
      //console.log(JSON.stringify(fav));
      //show save confirmation for 2 sec
      saveconfirmed.hidden = false;
      setTimeout(() => {
        saveconfirmed.hidden = true;
      }, 2000);
    }

    //set favorities in localstorage
    localStorage.setItem("nasaFavorities", JSON.stringify(fav));
  });
}

function removeFav(itemurl) {
  if (fav[itemurl]) {
    delete fav[itemurl];
    //set favorities in localstorage
    localStorage.setItem("nasaFavorities", JSON.stringify(fav));
    updatedom("favorites");
  }
}

//onload
getnasapictures();
