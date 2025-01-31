import { languages } from './../constants/index';
export function getLanguages(){
const response=[]
for (const [key, value] of Object.entries(languages)) {
  const val=value[0]
  response.push({key,value:val})
}
return response
}