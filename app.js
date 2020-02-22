/* Global Variables */
const weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
const weatherApiKey = "&appid=f1bb006fe5702add143fe115ea7a5173";

const unsplashUrl = "https://api.unsplash.com/search/photos?page=1&query=";
const unsplashApiKey = "&client_id=g-9sgbiT55ggjoCi_eFssZOewGDmFRjysKbofT62e30";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + " / " + d.getDate() + " / " + d.getFullYear();
let hours = new Date().getHours();

// html elements
const submitButton = document.getElementById("generate");
const formElements = document.querySelector("#submissionForm").elements;
const entryHolder = document.getElementById("entryHolder");

// General functions
const disableClicks = boolean => {
  for (formElement of formElements) {
    formElement.readOnly = boolean;
  }
};

const timeOfDay = () => {
  if (hours >= 00 && hours <= 12) {
    return "Good Morning";
  } else if (hours >= 12 && hours <= 17) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

const getWeather = async (weatherUrl, location, weatherApiKey) => {
  const res = await fetch(weatherUrl + location + weatherApiKey);
  try {
    const data = await res.json();
    if (data.cod === 200) {
      submitButton.classList.remove("loading");
      document.getElementById("entryHolder").scrollIntoView();
    } else {
      submitButton.classList.remove("loading");
      submitButton.classList.add("error");
      submitButton.setAttribute("title", `Error: ${data.message}`);
    }
    disableClicks(false);
    return data;
  } catch (error) {
    submitButton.classList.remove("loading");
    submitButton.classList.add("error");
    console.log("error", error);
  }
};

const backgroundImage = async (unsplashUrl, location, unsplashApiKey) => {
  const res = await fetch(unsplashUrl + location + unsplashApiKey);
  try {
    const image = await res.json();
    figureNumber = Math.round(Math.random() * 10);
    const firstImage = image.results[figureNumber].urls.full;
    entryHolder.setAttribute("style", `background: url(${firstImage});`);
  } catch (error) {
    console.log("error", error);
  }
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

const updateUI = async () => {
  const request = await fetch("/all");
  try {
    const allData = await request.json();
    //update UI components
    document.getElementById("temp__value").innerHTML = allData.temperature;
    document.getElementById("time").innerHTML = timeOfDay();
    document.getElementById("userName").innerHTML = allData.userName;
    document.getElementById("content__description").innerHTML =
      allData.userFeelings;
    document.getElementById(
      "location-display"
    ).innerHTML = `${allData.city}, ${allData.country}`;
    document.getElementById("date").innerHTML = newDate;
    document
      .getElementById("temp__icon")
      .setAttribute("title", allData.weather);
    document.getElementById("temp__icon").setAttribute("class", "");
    //apply icon based on time of day
    if (hours >= 00 && hours <= 18) {
      return document
        .getElementById("temp__icon")
        .classList.add("owf", `owf-${allData.icon}-d`);
    } else {
      document
        .getElementById("temp__icon")
        .classList.add("owf", `owf-${allData.icon}-n`);
    }
    // setTimeout(animateEntryHolder(), 10);
  } catch (error) {
    console.log("error", error);
  }
};

const animateEntryHolder = () => {
  entryHolder.removeAttribute("class");
  entryHolder.scrollIntoView();
};

submitButton.addEventListener("click", function(event) {
  event.preventDefault();
  disableClicks(true);
  this.className = "";
  this.classList.add("form-group__button");
  this.classList.add("loading");
  const location = document.getElementById("zip").value;
  const name = document.getElementById("name").value;
  const feelings = document.getElementById("feelings").value;

  getWeather(weatherUrl, location, weatherApiKey).then(data => {
    let information = {
      city: data.name,
      temperature: Math.round(data.main.temp - 273),
      country: data.sys.country,
      weather: data.weather[0].description,
      icon: data.weather[0].id,
      userName: name,
      userFeelings: feelings
    };
    postData("/add", information)
      .then(backgroundImage(unsplashUrl, location, unsplashApiKey))
      .then(updateUI())
      .then(animateEntryHolder());
  });
});
