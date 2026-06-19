const fs = require("fs");

async function capture(driver, name) {

    const image = await driver.takeScreenshot();

    if(!fs.existsSync("screenshots")){
        fs.mkdirSync("screenshots");
    }

    fs.writeFileSync(
        `screenshots/${name}.png`,
        image,
        "base64"
    );
}

module.exports = capture;