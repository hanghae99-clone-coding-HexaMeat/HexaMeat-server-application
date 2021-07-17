const express = require('express');
const app = express();
const connect = require('./models/index');

connect();

const Product = require('./models/product');
//const Product = require('./models/product');

////////////////////////////////////////////////////////////////////////////////////////////////////////
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

// 소고기는 디테일 이미지 두개밖에 없음
// 해산물들 상세페이지 확인필요

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: { width: 1024, height: 1600 },
    });
    const page = await browser.newPage();
    await page.goto('https://www.jeongyookgak.com/list');
    await page.waitForSelector(
        '#app > div.app__desktop > div > div:nth-child(2) > section.list-data > ul > li:nth-child(6)'
    );
    const html = await page.content();

    let $ = cheerio.load(html);
    const list = $('section.list-data ul li');
    await list.each(async (i, tag) => {
        if (i < 6) {
            console.log(i, '!!!!!!!!!!!!!!!!!!!!');
            let imgArr = [];
            let title = $(tag).find('h6').text();
            let priceStandard = $(tag).find('p').text();
            let category = 'pork';
            let price = priceStandard
                .split('/')[0]
                .split(' ')[1]
                .replace(',', '')
                .replace('원', '');
            imgArr.push($(tag).find('div picture img').attr('src'));

            await page.click(
                `#app > div.app__desktop > div > div:nth-child(2) > section.list-data > ul > li:nth-child(${
                    i + 1
                }) > div > picture > img`
            );
            await page.waitForSelector(
                '#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div:nth-child(1) > img'
            );
            await page.click('#detail-top__option-dropdown-btn');
            await page.waitForSelector(
                '#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > div > div.detail-top__content-option > div > div'
            );

            const html2 = await page.content();
            const $2 = cheerio.load(html2);
            imgArr.push(
                $2(
                    '#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div:nth-child(1) > img'
                ).attr('src')
            );
            imgArr.push(
                $2(
                    '#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div:nth-child(3) > img'
                ).attr('src')
            );
            imgArr.push(
                $2(
                    '#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div:nth-child(4) > img'
                ).attr('src')
            );
            const detailDesc = $2(
                '#app > div.app__desktop > div > div:nth-child(2) > section.detail-desc__container > div > div:nth-child(2) > div > div > div'
            ).text();
            const options = $2(
                '#app > div.app__desktop > div > div:nth-child(2) > section.detail-top__wrap > div > div > div > div.detail-top__content-option > div > div'
            ).text();
            console.log(title, price, imgArr, detailDesc, options);

            // await Product.create({title, priceStandard, price, imgArr, detailDesc, category})
            await page.goBack();
            await page.waitForSelector(
                '#app > div.app__desktop > div > div:nth-child(2) > section.list-data > ul > li:nth-child(6) > div > picture > img'
            );
        }
    });

    // await browser.close();
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////

// app.listen(8080, () => {
//     console.log('Hi!');
// })
