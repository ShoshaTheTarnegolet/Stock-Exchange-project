marqueeWork();

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('query');
const closeButton = document.getElementById('close');
const fas = document.querySelector('.fa-times');
const spinner = document.querySelector('.spinner-grow');
const searchTerm = searchInput.value;

/* events */
searchButton.addEventListener('click', () => {
  searchInput.classList.add('focus');
  searchButton.classList.add('clicked');
  closeButton.classList.add('clicked-close');
  fas.classList.add('focus');
  spinner.hidden = false;
  searchFetch();
});

closeButton.addEventListener('click', function () {
  searchInput.classList.toggle('focus');
  searchInput.value = '';
  searchButton.classList.toggle('clicked');
  fas.classList.toggle('focus');
  closeButton.classList.toggle('clicked-close');
  refresh();
});

/* main fetch */
const searchFetch = async function search() {
  const searchTerm = searchInput.value;
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchTerm}&limit=10&exchange=NASDAQ`;
  console.log(searchTerm);
  const res = await fetch(url);
  if (!res.ok) {
    const message = `An error has occured: ${res.status}`;
    throw new Error(message);
  } else {
    const data = await res.json();
    refresh();
    setTimeout(() => {
      spinner.hidden = true;
      searchRes(data);
      searchMatch();
    }, 2000);
  }
};

/* searching result block */
const searchRes = (data) => {
  for (let i = 0; i <= data.length - 1; i++) {
    const block = document.createElement('div');
    block.className = 'adblock';
    const container = document.getElementById('search-result');
    container.append(block);

    /*     link */
    const a = document.createElement('a');
    const companySymbol = data[i].symbol;
    Object.assign(a, {
      href: `./company.html?symbol=${companySymbol}`,
      innerHTML: `${i + 1}. Company Name: <b>${data[i].name}</b> and its symbol: <b>${companySymbol}</b>`,
      className: 'link',
      target: '_blank',
    });
    block.append(a);

    /* price changes and image */
    async function infoFetch() {
      const urlcompany = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quote/${companySymbol}`;
      const urlimage = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/profile/${companySymbol}`;
      const [cChange, cImage] = await Promise.all([fetch(urlcompany), fetch(urlimage)]);

      const change = await cChange.json();
      const logo = await cImage.json();

      return [change, logo];
    }

    infoFetch()
      .then(([change, logo]) => {
        change;
        const percent = document.createElement('span');
        percent.innerText = change[0].changesPercentage.toPrecision(3) + '%';
        if (change[0].changesPercentage < 0) {
          percent.className = 'negativeP';
        } else {
          percent.className = 'positiveP';
        }
        block.append(percent);

        logo;
        const image = document.createElement('img');
        Object.assign(image, {
          src: logo[0].image,
          title: `${logo[0].companyName} logo`,
          className: 'image',
          onerror: function (e) {
            image.src = './img/image-not-found.svg';
            image.title = 'image not found';
            image.className = 'notFound';
          },
        });
        block.prepend(image);
      })
      .catch((error) => {
        error.message;
        console.log(error.message);
        a.title = "Sorry, we can't get a stock change info. Please look in the console";

        const image = document.createElement('img');
        image.src = './img/image-not-found.svg';
        image.title = 'image not found';
        image.className = 'notFound';
        block.prepend(image);
      });
  }
};
/* match function */
const searchMatch = () => {
  const searchText = searchInput.value;
  let adblock = document.querySelectorAll('.link');
  for (let i = 0; i < adblock.length; i++) {
    let regex = new RegExp(searchText, 'gi');
    adblock[i].innerHTML = adblock[i].innerText.replace(regex, `<b class="highlight">$&</b>`);
  }
};
/* refresh */
const refresh = () => {
  const blocks = document.querySelectorAll('.adblock');
  for (let item of blocks) {
    item.remove();
  }
};
/* marquee */
async function marqueeWork() {
  const urlMarquee = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nasdaq`;
  const response = await fetch(urlMarquee);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  } else {
    const marqueeData = await response.json();
    const marquee = document.getElementById('marquee');
    for (let i = 0; i < 100; i++) {
      const marqueeText = document.createElement('p');
      const price_Info = {};
      price_Info.name = [];
      price_Info.name.push(marqueeData[i].symbol);
      price_Info.price = [];
      price_Info.price.push(marqueeData[i].price);
      marqueeText.innerHTML = `<b>${price_Info.name}</b><span> ${price_Info.price}</span> `;
      marquee.append(marqueeText);
    }
  }
}

/* debounce */
const debounce = (f, delay) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => f(), delay);
  };
};

const fetchDebounse = () => {
  const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput.value}&limit=10&exchange=NASDAQ`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      refresh();
      spinner.hidden = true;
      searchRes(data);
      searchMatch();
    });
};
searchInput.addEventListener('keyup', debounce(fetchDebounse, 300));

/* for changing url
const changeurl = () => {
  window.history.pushState(window.location.href, null,`?query=${searchInput.value}`)
}

*/
/* for enter

searchInput.addEventListener('keydown', (event) => {
  console.log(event);
  if (event.key === 'Enter') {
    searchInput.classList.add('focus');
    searchButton.classList.add('clicked');
    closeButton.classList.add('clicked-close');
    fas.classList.add('focus');
    spinner.hidden = false;
    searchFetch();
}
});
 */
