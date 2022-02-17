'use strict';
//

const listUrl = `https://
mate-academy.github.io/phone-catalogue-static/api/phones.json`;
const detailsUrl = `https://
mate-academy.github.io/phone-catalogue-static/api/phones/`;

function getPhones() {
  return fetch(listUrl)
    .then(response => {
      if (!response.ok) {
        setTimeout(() => {
          return Promise.reject(new Error(`${response.status}:
          ${response.statusText}`));
        }, 5000);
      }

      return response.json();
    });
}

function getFirstReceivedDetails(arrPhonesID) {
  const arrForRace = arrPhonesID.map(phoneId => {
    return fetch(`${detailsUrl}/${phoneId}.json`)
      .then(response => {
        if (!response.ok) {
          throw Error(`${response.status} - ${response.statusText}`);
        }

        return response.json();
      });
  });

  return Promise.race(arrForRace);
}

function getAllSuccessfulDetails(arrayOfIds) {
  const arr = arrayOfIds.map(phoneId => {
    return fetch(`${detailsUrl}/${phoneId}.json`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      });
  });

  return new Promise((resolve) => {
    resolve(arr);
  });
}

const divFirstReceived = document.createElement('div');
const divAllSuccessful = document.createElement('div');

divFirstReceived.className = 'first-received';
divAllSuccessful.className = 'all-successful';

divFirstReceived.insertAdjacentHTML('beforeend',
  `<h3>First Received</h3>`);

divAllSuccessful.insertAdjacentHTML('beforeend',
  `<h3>All Successful</h3>`);

getPhones()
  .then(result => {
    const arrPhonesId = result.map(el => el.id);

    getFirstReceivedDetails(arrPhonesId)
      .then(firstResolve => {
        divFirstReceived.insertAdjacentHTML('beforeend',
          `<li>Name: ${firstResolve.name} (ID:${firstResolve.id})</li>`);
      })
      .catch();

    getAllSuccessfulDetails(arrPhonesId)
      .then(arr => {
        arr.forEach(elem => {
          elem.then(res => {
            divAllSuccessful.insertAdjacentHTML('beforeend',
              `<li>Name: ${res.name} (ID:${res.id})</li>`);
          });
        });
      })
      .catch();

    document.body.append(divFirstReceived, divAllSuccessful);
  })
  .catch();
