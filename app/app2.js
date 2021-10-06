const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get('symbol');
const spinner = document.querySelector('.spinner-grow');
spinner.hidden = false;

/* main fetch */
const link = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
fetch(link)
  .then((res) => {
    if (res.status != 200) {
      alert('Fetch is not happening');
      return;
    }
    return res.json();
  })
  .then((data) => {
    setTimeout(function () {
      spinner.hidden = true;
      companyBlock(data);
      fetch(priceLink);
    }, 2000);
  });

/*create company block */
const companyBlock = (data) => {
  const profile = data.profile;

  /*  header */
  const cHeader = document.createElement('h1');
  cHeader.className = 'companyHeader';
  cHeader.innerText = profile.companyName;

  const cPrice = document.createElement('p');
  cPrice.innerText = `$${profile.price} `;
  cPrice.className = 'stock-price';

  const priceChanges = document.createElement('span');
  const percent = parseFloat(profile.changesPercentage).toFixed(2);
  priceChanges.innerText = `${percent}%`;
  if (profile.changesPercentage < 0) {
    priceChanges.className = 'negativeP';
  } else {
    priceChanges.className = 'positiveP';
  }
  cPrice.append(priceChanges);

  const headerblock = Object.assign(document.createElement('div'), { className: 'headerblock' });
  headerblock.append(cHeader, cPrice);

  /* company profile + image */
  const cDescription = document.createElement('p');
  cDescription.innerText = profile.description;
  cDescription.className = 'description';

  const image = document.createElement('img');
  image.title = `${profile.companyName} logo`;
  image.src = profile.image;
  image.onerror = function (e) {
    image.src = './img/image-not-found.svg';
    image.title = 'image not found';
    image.className = 'notFound';
  };

  const cWeb = document.createElement('a');
  Object.assign(cWeb, {
    href: profile.website,
    target: '_blank',
    className: 'link',
    innerHTML: '<br>For more information about ' + `${data.profile.companyName}`,
  });
  cDescription.append(cWeb);

  const cBlock = document.createElement('div');
  cBlock.className = 'companyBlock';
  cBlock.append(cDescription, image);

  /* block with all info */
  const block = document.createElement('div');
  block.className = 'adblock';
  block.append(headerblock);
  block.append(cBlock);

  const container = document.querySelector('.container');
  container.prepend(block);
};

/* chart fetch*/
const priceLink = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
fetch(priceLink)
  .then((res) => res.json())
  .then((data) => {
    setTimeout(function () {
      const historical = data.historical;

      const date = [];
      for (let i = 0; i < historical.length && i < 500; i += 30) {
        date.push(historical[i].date);
      }

      const price = [];
      for (let i = 0; i < historical.length && i < 500; i += 30) {
        price.push(historical[i].close);
      }

      /* chart */
      console.log(document.querySelector('.companyHeader').innerText);
      const name = document.querySelector('.companyHeader').innerText;
      let delayed;
      const chart = document.getElementById('myChart');
      const myChart = new Chart(chart, {
        type: 'line',
        data: {
          labels: date,
          datasets: [
            {
              label: `${symbol} price`,
              data: price,
              backgroundColor: ['#ff9371'],
              borderColor: ['#ff9371'],
              borderWidth: 1,
              fill: false,
              stepped: true,
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            intersect: false,
            axis: 'x',
          },
          plugins: {
            title: {
              display: true,
              text: `History of stock price of ${name}`,
            },
          },

          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
          scales: {
            y: {
              stacked: true,
            },
          },
        },
      });
    }, 2300);
  });
