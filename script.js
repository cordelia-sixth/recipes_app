// Random Recipe
const mealsElm = document.getElementById('meals');

getRandomMeal();

// ランダムな料理のデータを1つ取得する
async function getRandomMeal() {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const respData = await resp.json();
  const randomMeal = respData.meals[0]

  console.log(randomMeal);
  
  addMeal(randomMeal, true);
}

// idから料理を検索
async function getMealById(id) {
  const meal = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
}

// 料理名で検索
async function getMealsBySearch(term) {
  const meals = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
}

// 料理コンテナを作成する
function addMeal(mealData, random = false) {
  const meal = document.createElement('div');
  meal.classList.add('meal');

  // 追加する要素を作成
  meal.innerHTML = `
    <div class="meal-header">
      ${random ? `
      <span class="random">
        Recipe
      </span>` : ''}
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
      <button class="fav-btn">
        <i class="fas fa-heart"></i>
      </button>
    </div>
  `;

  const btn = meal.querySelector('.meal-body .fav-btn');

  btn.addEventListener('click', event => {
    btn.classList.toggle('active');
  });

  mealsElm.appendChild(meal);
}