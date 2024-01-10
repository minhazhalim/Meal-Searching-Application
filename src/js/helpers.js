import {async} from 'regenerator-runtime';
import {TIMEOUT_SEC} from './config.js';
const timeout = function (s){
     return new Promise(function (_,reject){
          setTimeout(function (){
               reject(new Error(`Request Took Too Long! Timeout After ${s} Second`));
          },s * 1000);
     });
};
export const AJAX = async function (url,uploadData = undefined){
     try {
          const fetchPro = uploadData ? fetch(url,{
               method: 'POST',
               headers: {'Content-Type': 'application/json',},
               body: JSON.stringify(uploadData),
          }) : fetch(url);
          const response = await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]);
          const data = response.json();
          if(!response.ok) throw new Error(`${data.message} (${response.status})`);
          return data;
     }catch(error){
          throw error;
     }
};