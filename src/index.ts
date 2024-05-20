import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.airbnb.com/?tab_id=home_tab&search_mode=flex_destinations_search&flexible_trip_lengths%5B%5D=one_week&location_search=MIN_MAP_BOUNDS&monthly_start_date=2024-06-01&monthly_length=3&monthly_end_date=2024-09-01&price_filter_input_type=0&channel=EXPLORE&category_tag=Tag:8661&search_type=filter_change&price_filter_num_nights=5&l2_property_type_ids%5B%5D=4&price_max=150"
  );

  const itemsSelector = "[data-testid='card-container']";

  const ratingSelector =
    "div.a8jhwcl.atm_c8_vvn7el.atm_g3_k2d186.atm_fr_1vi102y.atm_9s_1txwivl.atm_ar_1bp4okc.atm_h_1h6ojuz.atm_cx_t94yts.atm_le_14y27yu.atm_c8_sz6sci__14195v1.atm_g3_17zsb9a__14195v1.atm_fr_kzfbxz__14195v1.atm_cx_1l7b3ar__14195v1.atm_le_1l7b3ar__14195v1.dir.dir-ltr > div:nth-child(2)";
  const ratingSelector2 =
    "#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(1) > div > div > div > section > div.rk4wssy.atm_c8_km0zk7.atm_g3_18khvle.atm_fr_1m9t47k.atm_cs_9dzvea.atm_h3_ftgil2.atm_9s_1txwivl.atm_h_1h6ojuz.atm_cx_1y44olf.atm_c8_2x1prs__oggzyc.atm_g3_1jbyh58__oggzyc.atm_fr_11a07z3__oggzyc.dir.dir-ltr > div.r1lutz1s.atm_c8_o7aogt.atm_c8_l52nlx__oggzyc.dir.dir-ltr";
  const ratingSelector3 =
    "#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(2) > div > div > div > a > div > div.a8jhwcl.atm_c8_vvn7el.atm_g3_k2d186.atm_fr_1vi102y.atm_9s_1txwivl.atm_ar_1bp4okc.atm_h_1h6ojuz.atm_cx_t94yts.atm_le_14y27yu.atm_c8_sz6sci__14195v1.atm_g3_17zsb9a__14195v1.atm_fr_kzfbxz__14195v1.atm_cx_1l7b3ar__14195v1.atm_le_1l7b3ar__14195v1.dir.dir-ltr > div:nth-child(2)";
  const imageSelector = "._skzmvy img";
  const priceSelector = "._1y74zjx";
  const roomsSelector =
    "div.o1kjrihn.atm_c8_km0zk7.atm_g3_18khvle.atm_fr_1m9t47k.atm_h3_1y44olf.atm_c8_2x1prs__oggzyc.atm_g3_1jbyh58__oggzyc.atm_fr_11a07z3__oggzyc.dir.dir-ltr > ol";
  const titleSelector =
    "div.toieuka.atm_c8_2x1prs.atm_g3_1jbyh58.atm_fr_11a07z3.atm_cs_9dzvea.atm_c8_sz6sci__oggzyc.atm_g3_17zsb9a__oggzyc.atm_fr_kzfbxz__oggzyc.dir.dir-ltr > h2";
  const amenitiesSelector =
    "div.c16f2viy.atm_9s_1txwivl.atm_h_1fhbwtr.atm_fc_1y6m0gg.atm_be_1g80g66.atm_gz_1xo9vth.atm_h0_1xo9vth.atm_vy_1pz0x4r.atm_gz_1xo9vth__kgj4qw.atm_h0_1xo9vth__kgj4qw.atm_vy_1pz0x4r__kgj4qw.atm_gz_gsbcly__oggzyc.atm_h0_gsbcly__oggzyc.atm_vy_1mqvw0v__oggzyc.atm_gz_gsbcly__1v156lz.atm_h0_gsbcly__1v156lz.atm_vy_1mqvw0v__1v156lz.atm_gz_gsbcly__qky54b.atm_h0_gsbcly__qky54b.atm_vy_1mqvw0v__qky54b.atm_gz_gsbcly__jx8car.atm_h0_gsbcly__jx8car.atm_vy_1mqvw0v__jx8car.dir.dir-ltr div._19xnuo97";

  await page.waitForSelector(itemsSelector);
  const itemUrlAndLocation = await page.$$eval(itemsSelector, (els) => {
    return els.slice(0, 2).map((el) => {
      const itemUrlSelector =
        "[data-testid='card-container'] a.l1ovpqvx[href^='/rooms/']";
      const locationSelector = "[data-testid='listing-card-title']";
      return {
        url: el.querySelector(itemUrlSelector)?.getAttribute("href"),
        location: el.querySelector(locationSelector)?.textContent || "",
      };
    });
  });

  const getHotelDetails = async (url: string, location: string) => {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector(priceSelector, { timeout: 15000 });
    await Promise.race([
      page.waitForSelector(ratingSelector),
      page.waitForSelector(ratingSelector2),
      page.waitForSelector(ratingSelector3),
    ]);
    const rating = await page.evaluate(
      async (r1, r2, r3) => {
        const rating1 = document.querySelector(r1);
        const rating2 = document.querySelector(r2);
        const rating3 = document.querySelector(r3);
        if (rating1) {
          return rating1.textContent;
        } else if (rating3) {
          return rating3.textContent;
        } else if (rating2) {
          return document.querySelector(r2)?.textContent;
        } else {
          return document.querySelector(
            "#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(2) > div > div > div > a > div > div.a8jhwcl.atm_c8_vvn7el.atm_g3_k2d186.atm_fr_1vi102y.atm_9s_1txwivl.atm_ar_1bp4okc.atm_h_1h6ojuz.atm_cx_t94yts.atm_le_14y27yu.atm_c8_sz6sci__14195v1.atm_g3_17zsb9a__14195v1.atm_fr_kzfbxz__14195v1.atm_cx_1l7b3ar__14195v1.atm_le_1l7b3ar__14195v1.dir.dir-ltr > div:nth-child(2)"
          )?.textContent;
        }
      },
      ratingSelector,
      ratingSelector2,
      ratingSelector3
    );
    const price = await page.$eval(priceSelector, (el) => {
      const priceString = el.textContent ? el.textContent?.trim() : "";
      const priceMatch = priceString.match(/[\d|,|.]+/gm);
      const currency = priceString
        .replace(/[\d|,|.]+/gm, "")
        .replace(/\s/gm, "");
      const value = priceMatch
        ? parseFloat(priceMatch[0].replace(".", ""))
        : null;
      return {
        currency,
        value,
      };
    });
    const { cover, images } = await page.$$eval(imageSelector, (el) => ({
      cover: el[0].getAttribute("src"),
      images: el.slice(1, el.length).map((e) => e.getAttribute("src")),
    }));
    const rooms = await page.$eval(roomsSelector, (el) =>
      el.textContent?.split("·  ·").map((e) => e.trim())
    );
    const title = await page.$eval(titleSelector, (el) =>
      el.textContent?.trim()
    );
    const amenities = await page.$$eval(amenitiesSelector, (el) =>
      el.filter((e) => !e.querySelector("del")).map((e) => e.textContent)
    );
    return {
      title,
      location,
      rating,
      price,
      amenities,
      cover,
      images,
      rooms,
      url,
    };
  };

  const items = itemUrlAndLocation.map(async (item) => {
    item.url = `https://www.airbnb.com.tr${item.url}`;
    return await getHotelDetails(item.url, item.location);
  });

  const a = await Promise.all(items);

  console.log("a :>> ", a);
  // save to json file
  fs.writeFileSync("items.json", JSON.stringify(a, null, 2));
  await browser.close();
})();
