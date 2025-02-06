import { languages } from "../constants/index";
export function getLanguages() {
  const response = [];
  for (const [key, value] of Object.entries(languages)) {
    const val = value;
    response.push({
      language: { label: key.split("-")[0], value: key },
      voice: { labels: val.map((v) => v.split("-")[0]), values: val }
    });
  }
  return response;
}

export async function getFormattedLanguages() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getLanguages());
    }, 1000);
  });
}

export async function getLanguagesListWithVoicesAndFlags(){

}

// export async function getFormattedLanguages(){
// const langs=await getLanguageList()
// console.log(langs)
// }

// function convertToJSON(data) {
//   // Create an empty object to store the converted JSON
//   const jsonObject = {};

//   // Iterate over each language-name pair
//   data.forEach(([language, names]) => {
//     // Add a property to the JSON object with the language as the key
//     jsonObject[language] = names;
//   });

//   // Return the JSON object
//   return jsonObject;
// }
