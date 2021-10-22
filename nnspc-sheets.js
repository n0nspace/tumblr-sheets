const url = "https://sheets.googleapis.com/v4/spreadsheets/" + sheetID + "/values/" + sheetTab + "?alt=json&key=" + APIkey + "";


var sortedSheet = {};

const content = {
    html: function() {
        return $.getJSON(url).then(function(data) {

            //spread data
            const entry = data.values;

            //spread info (used for loops), amount of:
            const rows = data.values.length;
            const columns = data.values[0].length;
            const cells = rows * columns;


            //for every row + 1 after headline row
            for (let k = 1; k < rows; k++) {
              //create new nested object
              sortedSheet[k] = {};


              //for every column
              for (let j = 0; j < columns; j++) {

                let columnTitle = entry[0][j];
                let currentRow = entry[k][j];

                sortedSheet[k][columnTitle] = currentRow;

              }
            }
        });
    }
};

content.html().done(function(html) {
  $.when(replaceKeys(sortedSheet)).then(createContent(sortedSheet));
});


//apply data to templates
function createContent(results, templateNum) {
  $(document).ready(function() {
    var data = results;
    //iterate through templates
    for (i = 0; i < templateList.length; i++) {
      let source = $(templateList[i][0]).html();
      let template = Handlebars.compile(source);
      let html = template(data);
      //write data into template
      $(templateList[i][1]).append(html);
    }
    if (typeof contentLoaded === 'undefined') {

    } else {
      contentLoaded();
    }
  });
}

//FORMATING FUNCTIONS
//format keys: remove spaces & lowercase
function replaceKeys(object) {
  Object.keys(object).forEach(function(key) {
    var newKey = key.replace(/\s+/g, '').toLowerCase();
    if (object[key] && typeof object[key] === 'object') {
      replaceKeys(object[key]);
    }
    if (key !== newKey) {
      object[newKey] = object[key];
      delete object[key];
    }
  });
}
