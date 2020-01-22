const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const { base64encode, base64decode } = require('nodejs-base64');
var mjAPI = require("mathjax-node-svg2png");

mjAPI.config({
  MathJax: {
    SVG: {
      scale: 100,
      font: "MyriadPro-Regular"
    },
    // MatchWebFonts: {
    //     matchFor: {
    //         "HTML-CSS": false,
    //         NativeMML: false,
    //         SVG: true
    //     },
    //     fontCheckDelay: 2000,
    //     fontCheckTimeout: 30 * 1000
    // }
  }
});
mjAPI.start();

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}


var result = MyFunction('./T_13570164641479204.xml')

async function MyFunction(theXmlFile) {
  var parser = new xml2js.Parser();
  fs.readFile(theXmlFile, async function (err, data) {
    parser.parseString(data, async function (err, result) {
      let data = JSON.stringify(result, null, 2);
      fs.writeFileSync('xml.json', data);
      var quest = result.questionSet;
      var que = quest.question
      // console.log(que)
      que.forEach(async function (value) {
        // console.log(value.media_set[0].internal_media)
        if (typeof value.media_set !== 'undefined') {
          var internalMedia = value.media_set[0].internal_media
          for(media of internalMedia ) {
            // var buff = new Buffer(media.mediaData[0].data, 'base64');
            var decoded = base64decode(media.mediaData[0].data[0])
            var fileName = media.name[0]
            var i = 0;
            if (fileName.includes('mml')) {
              console.log("start", fileName)
              mjAPI.typeset({
                math: decoded,
                format: "MathML", // or "inline-TeX", "MathML"
                // svg: true,
                // css: true,
                png: true,              // enable PNG generation
                scale: 3,
                speakText: true,
                useFontCache: false,
                useGlobalCache: false,
              },async function (data) {
                console.log(i)
                if (!data.errors) {
                  // var orignalSet[decoded] = data.svg;
                  // console.log(data.png)
                  var base64String = data.png
                  console.log(fileName)
                  var base64Image = base64String.split(';base64,').pop();
                  fs.writeFileSync(`./Output/${fileName}.png`, base64Image, {encoding: 'base64'},function (err, data) {
                    if (err) console.log(err);
                    console.log("Successfully Written to File.");
                  });
                }
                i++
              });
            }
          }
        }
      });
      
      // console.log(XLSX.utils.sheet_to_json(ws));
      console.log('Done');
    });
  });
  return 'true'
}