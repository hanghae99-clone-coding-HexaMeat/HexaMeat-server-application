const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Product = require('./models/product');
const { next } = require('cheerio/lib/api/traversing');

mongoose.connect('mongodb://localhost:27017/crolling', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

(async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.setViewport({
        //페이지 크기 설정
        width: 1600,
        height: 1000,
    });

    await page.goto('https://www.jeongyookgak.com/list');

    const contents = await page.content();
    const $ = cheerio.load(contents);

    const categoryUl = $('#app > div.app__desktop > div > div:nth-child(2) > section.list-tab > ul > li')
    for (let i = 1; i <= 3; i++){ //일단 닭까지만 크롤링
      page.click(`#app > div.app__desktop > div > div:nth-child(2) > section.list-tab > ul > li:nth-child(${i})`)
      let category = $(`#app > div.app__desktop > div > div:nth-child(2) > section.list-tab > ul > li:nth-child(${i}) > p`).text();
    

    const lists = $(
        '#app > div.app__desktop > div > div:nth-child(2) > section.list-data > ul > li'
    );

    await page.waitForSelector(
        '#app > div.app__desktop > div > div:nth-child(2) > section.list-data > ul'
    );
    //
    for (let i = 1; i < lists.length; i++) {
        console.log(lists.length);
        let selector = `#app > div.app__desktop > div > div:nth-child(2) > section.list-data > ul > li:nth-child(${i}) > div > picture > img`;
        console.log($(selector));
        if (!$(selector)) {
            selector = `#app > div.app__desktop > div > div:nth-child(2) > section.list-data > ul > li:nth-child(${i}) > div > div.list-item__block`;
        }
        await page.click(selector);

        await page.waitForTimeout(500);

        const content = await page.content();
        const $$ = cheerio.load(content);

        let title = $$(
            '#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > div > h2'
        ).text();
        let priceStandard = $$(
            '#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > div > p.detail-top__content-price'
        ).text();
        let price = $$(
            '#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > div > p.detail-top__content-price'
        )
            .text()
            .split(' ')[1]
            .split('/')[0]
            .replace(',', '')
            .replace('원', '');
        let img = $$(
            '#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > picture > img'
        ).attr('src');
        let freeAntibiotic = false;
        if (title.indexOf('무항생제') !== -1) {
            freeAntibiotic = true;
        }

        

        //상품 상세설명 이미지
        let detailImage = [];
        let detailImages = $$(
            '#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div'
        );
        for (let i = 1; i <= detailImages.length; i++) {
            let selectorDeatilImage = `#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div:nth-child(${i}) > img`;
            a = $$(selectorDeatilImage).attr('src');
            if (a === undefined) {
                continue;
            }
            detailImage.push($$(selectorDeatilImage).attr('src'));
        }
        // 상품 옵션
        let productOption = [];
        await page.click('#detail-top__option-dropdown-arrow');
        await page.waitForTimeout(1000);
        // 드롭다운 클릭을 하고 페이지의 html이 새로 생성 되었기 때문에 현재 페이지의 html을 다시 cheerio로 로드 해줘야 함.
        const dropdown = cheerio.load(await page.content());
        let dropdownLength = dropdown(
            '#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > div > div.detail-top__content-option > div > div > div'
        ).length;

        for (let i = 0; i <= dropdownLength; i++) {
            let dropdownVal = dropdown(
                `#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > div > div.detail-top__content-option > div > div > div:nth-child(${i}) > div`
            ).text();
            if (dropdownVal === '') {
                continue;
            }
            productOption.push(dropdownVal);
        }

        //상품 정보
        let productInfo = $$(
            '#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div:nth-child(2) > div > div > div'
        ).text();

        const product = new Product({
            title,
            priceStandard,
            price,
            img,
            freeAntibiotic,
            category,
            detailImage,
            productInfo,
            productOption,
        });
        product.save();

        await page.goBack();
    }
  }

    await browser.close();
})();

