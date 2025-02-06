import { languages } from './../constants/index';
export function getLanguages(){
const response=[]
for (const [key, value] of Object.entries(languages)) {
  const val=value[0]
  response.push({key,value:val})
}
return response
}

export async function getFormattedLanguages(){
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getLanguages())
    }, 1000);
  })
}

