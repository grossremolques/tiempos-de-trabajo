export const getDataInJSON = (array) => {
  const headers = array[0];
  const newArray = []; 
  for (var i = 1; i < array.length; i++) {
    // Iteramos desde 1 para evitar el primer elemento que son los encabezados
    const obj = {};
    // Iteramos a través de cada elemento del array actual
    for (var j = 0; j < headers.length; j++) {
      // Usamos los encabezados como claves y asignamos los valores correspondientes
      obj[headers[j].toLowerCase()] = array[i][j];
    }
    newArray.push(obj); // Agregamos el objeto al nuevo array
  }
  return newArray;
};
export const normalizeString = (str) => {
  if(!str) return ""
  return str
    .toLocaleString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase(); 
}
export const getDataInArray = (data, headers) => {
  for (let i = 0; i < headers.length; i++) {
    const item = headers[i];
    if (data.hasOwnProperty(item)) {
      headers[i] = data[item];
    } else {
      headers[i] = ""; 
    }
  }
  return headers;
}
export const dataJoin = (data1, data2, att1, att2) => {
  const newArr = data1.map((item) => {
    data2.map(elem => {
      if(item[att1] === elem[att2]) {
        Object.assign(item, elem)
      }
    })
  })
  console.log(newArr)
  return newArr;
}

