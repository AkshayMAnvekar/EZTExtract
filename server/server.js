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

MyFunction()

async function MyFunction() {
  fs.readdirSync('./Input/').forEach(file => {
    fs.readFile('./Input/' + file, 'utf-8', async function (err, cont) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      console.log('File: ',file,' Start')
      var result = await MyXmlFunction(`./Input/${file}`)
      console.log('File: ', file, ' End')
    });
    console.log(file);
  });
}

async function MyXmlFunction(theXmlFile) {
  var folderName = path.parse(theXmlFile).name;
  if (!fs.existsSync(`./Output/${folderName}`)) {
    fs.mkdirSync(`./Output/${folderName}`);
  }
  if (!fs.existsSync(`./Output/${folderName}/MML`)) {
    fs.mkdirSync(`./Output/${folderName}/MML`);
  }
  var parser = new xml2js.Parser();
  fs.readFile(theXmlFile, async function (err, data) {
    parser.parseString(data, async function (err, result) {
      let data = JSON.stringify(result, null, 2);
      fs.writeFileSync('xml.json', data);
      var quest = result.questionSet;
      var que = quest.question
      que.forEach(async function (value) {
        if (typeof value.media_set !== 'undefined') {
          var internalMedia = value.media_set[0].internal_media
          for(media of internalMedia ) {
            // var buff = new Buffer(media.mediaData[0].data, 'base64');
            var decoded = base64decode(media.mediaData[0].data[0])
            var fileName = media.name[0]
            if (fileName.split('.').pop() === 'mml') {  
              console.log('File: ', fileName, ' Start')
              fs.writeFileSync(`./Output/${folderName}/MML/${fileName}`, decoded, async function (err, data) {
                if (err) {
                  console.log(err);
                }
                console.log("Successfully Written to File.");
              });
              console.log('File: ', fileName, ' End')

            }
          }
        }
      });
      console.log('File: ', `./Output/${folderName}/MML/`, ' Read Start')
      await readFiles(`./Output/${folderName}/MML/`, folderName)
      console.log('File: ', `./Output/${folderName}/MML/`, ' Read End')
      // console.log(XLSX.utils.sheet_to_json(ws));
      console.log('Done');
    });
  });
  return 'true'
}

async function readFiles(dirname, fldrName) {
  fs.readdirSync(dirname).forEach(file => {
    fs.readFile(dirname + file, 'utf-8', async function (err, cont) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      console.log('File: ', file, ' Start')
      await onFileContent(file, cont, fldrName);
      console.log('File: ', file, ' End')

    });
    console.log(file);
  });
  // fs.readdir(dirname, function (err, filenames) {
  //   if (err) {
  //     return console.log('Unable to scan directory: ' + err);
  //   }
  //   filenames.forEach(function (file) {
  //     fs.readFile(dirname + file, 'utf-8', function (err, cont) {
  //       if (err) {
  //         return console.log('Unable to scan directory: ' + err);
  //       }
  //       onFileContent(file, cont);
  //     });
  //   });
  // });
}

async function onFileContent(filename, content, fName) {
  if (!fs.existsSync(`./Output/${fName}/image`)) {
    fs.mkdirSync(`./Output/${fName}/image`);
  }
  if (filename.split('.').pop() === 'mml') {
    console.log("start", filename)
    mjAPI.typeset({
      math: content,
      format: "MathML", // or "inline-TeX", "MathML"
      // svg: true,
      // css: true,
      png: true,              // enable PNG generation
      scale: 3,
      speakText: true,
      useFontCache: false,
      useGlobalCache: false,
    },async function (data) {
      if (!data.errors) {
        // var orignalSet[decoded] = data.svg;
        // console.log(data.png)
        var base64String = data.png
        console.log(filename)
        var base64Image = base64String.split(';base64,').pop();
        console.log('File: ', `./Output/${fName}/image/${filename}.png`, ' Write Start')

        fs.writeFileSync(`./Output/${fName}/image/${filename}.png`, base64Image, {encoding: 'base64'},function (err, data) {
          if (err) {
            console.log(err);
          }
          console.log("Successfully Written to File.");
        });
        console.log('File: ', `./Output/${fName}/image/${filename}.png`, ' Write End')

      }
    });
  }
}