// Random Recipe
const mealsElm = document.getElementById('meals');
// お気に入りレシピ
const favoriteContainer = document.getElementById('fav-meals');

getRandomMeal();
fetchFavMeals();

// ランダムな料理のデータを1つ取得する
async function getRandomMeal() {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const respData = await resp.json();
  const randomMeal = respData.meals[0]

  console.log(randomMeal);
  
  addMeal(randomMeal, true);
}

// idからレシピ情報をフェッチ
async function getMealById(id) {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  console.log('resp', resp);

  // JSONに変換
  const respData = await resp.json();
  console.log('respDatta', respData);

  const meal = respData.meals[0];
  return meal;
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
        Today's Recipe
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

  const btn = meal.querySelector('.fav-btn');

  //  お気に入りとして保存する
  btn.addEventListener('click', event => {

    // お気に入り解除
    if (btn.classList.contains('active')) {
      removeMeal(mealData.idMeal);
      removeMealElm(mealData.idMeal);
      btn.classList.remove('active');

    } else {
      addMealToLS(mealData.idMeal);
      btn.classList.add('active');
    }

    fetchFavMeals();
  });

  mealsElm.appendChild(meal);
}

// レシピをお気に入りとしてローカルストレージに保存する
function addMealToLS(mealID) {
  // 保存してあるレシピを取得する
  // 
  const mealIds = getMeals();
  console.log(mealIds);

  // NOTE
  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealID]));
}

// レシピをローカルストレージから削除する
function removeMeal(mealId) {
  // ローカルストレージからデータを取得
  const mealIds = getMeals();

  // 削除したいレシピIDを取り除く
  const newMealIds = mealIds.filter(id => id !== mealId);
  console.log(newMealIds);

  // ローカルストレージにデータを戻す
  localStorage.setItem('mealIds', JSON.stringify(newMealIds));
}

// レシピを画面から削除する
function removeMealElm(mealId) {
  document.getElementById(mealId).remove();
}

// お気に入りレシピをローカルストレージから取得する
function getMeals() {
  // レシピをjsonに変換する
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));
  
  // ローカルストレージに何もなかった場合は空の配列を返す
  return mealIds === null ? [] : mealIds;
}

// お気に入りの料理レシピをAPIサーバーからフェッチ
async function fetchFavMeals() {

  // ローカルストレージからお気に入りレシピのIDを取得
  const mealIds = getMeals();

  for(let i = 0; i < mealIds.length; i++) {
    // レシピID
    const mealId = mealIds[i];

    // すでに画面に表示されているかチェック
    if (document.getElementById(mealId) === null) {
      // IDを元にレシピ情報をフェッチ
      const meal = await getMealById(mealId);

      // お気に入りレシピとして表示
      addMealFav(meal);
    }
  }
}

// お気に入りレシピを画面に表示
function addMealFav(mealData) {
  const favMeal = document.createElement('li');

  // 料理idを要素idとして付ける
  favMeal.id = mealData.idMeal;

  // 追加する要素を作成
  favMeal.innerHTML = `
    <img
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"
    />
    <span>${mealData.strMeal}</span>
    <button class="clear">
      <i class="fas fa-times-circle"></i>
    </button>
  `;

  // 削除ボタン
  const clearBtn = favMeal.querySelector('.clear');
  clearBtn.addEventListener('click', () => {
    removeMeal(mealData.idMeal);
    removeMealElm(mealData.idMeal);
  });

  favoriteContainer.appendChild(favMeal);
}
