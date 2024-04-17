const form = document.querySelector(".form");
const input = document.querySelector("input");
const div = document.querySelector(".recipe-container");
const buttonsDiv = document.querySelector(".buttons");
let allRecipes = [];
const renderRecipes = (array) => {
  div.innerHTML = "";
  buttonsDiv.innerHTML = "";
  // buttonsDiv.innerHTML += "<button>All</button>";
  const cuisineTypes = array.reduce(
    (acc, el) => {
      acc.push(...el.recipe.cuisineType);
      return acc;
    },
    ["all"]
  );
  const uniqueTypes = [...new Set(cuisineTypes)];
  uniqueTypes.forEach((type) => {
    buttonsDiv.innerHTML += `<button class='button'>${type}</button>`;
  });
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) =>
    button.addEventListener("click", (e) => {
      filterRecipes(e.target.innerText);
    })
  );
  array.forEach((item) => {
    const { image, label } = item.recipe;
    const name = label.length > 15 ? label.slice(0, 15).concat("...") : label;
    div.innerHTML += `<div class='recipe'><h4>${name}</h4><img src='${image}'/></div>`;
    const recipeDivs = document.querySelectorAll(".recipe");
    recipeDivs.forEach((el, index) => {
      el.addEventListener("mouseenter", (e) => {
        e.target.firstChild.innerText = array[index].recipe.label;
      });
    });
  });
};

const getRecipes = async () => {
  try {
    //base url: https://api.edamam.com/search
    //query parameters: id, unique key, search string
    //separated by ?
    //q params separated by &
    const res = await fetch(
      `https://api.edamam.com/search?app_id=e44a465a&app_key=78bc67fe1395b0246c033e4a9f234285&q=${input.value}&to=50`
    );
    const data = await res.json();
    allRecipes = data.hits;
    renderRecipes(data.hits);

    if (data.status === "error") {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error, "err");
  }
};

const filterRecipes = (cuisineType) => {
  // let newArr;
  // if (cuisineType === "all") {
  //   newArr = allRecipes
  // } else {
  //   newArr = allRecipes.filter((item) =>
  //     item.recipe.cuisineType.includes(cuisineType)
  //   );
  // }

  const newArr =
    cuisineType === "all"
      ? allRecipes
      : allRecipes.filter((item) =>
          item.recipe.cuisineType.includes(cuisineType)
        );

  renderRecipes(newArr);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getRecipes();
});
