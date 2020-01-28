//========================================================================================================
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheetMap = ss.getSheetByName('QUADRANT');

//========================================================================================================
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheetCCList = ss.getSheetByName('CEREALIERS');

//========================================================================================================
function onOpen() {
  Logger.log("onOpen")
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('BYOP')
  .addItem('Update Map', 'updateMap')
  .addSeparator()
  .addToUi();
}

var red15cc = ["#ec2400", "#ec5300", "#ec9b00", "#ecca00"];
var green9cc = ["#00b22a", "#90ec7c", "#c2ffc3", "#e2fcd3"];

function updateMap()
{
  var sheetCCListRange = sheetCCList.getRange("C7:H115");
  //var sheetCCListRange = sheetCCList.getRange("C7:H115");
  var sheetCCListValues = sheetCCListRange.getValues();
  for(var i=0; i<sheetCCListValues.length; i++)
  {
    Logger.log(sheetCCListValues[i][2])
    var coordsArray = sheetCCListValues[i][2].replace('(', '').replace(')', '').split("|");

    coordsArray = coordsArray.map(function(e){return parseInt(e.replace('−', '-').replace(/[^\x20-\xFF]+/g, ''), 10);});
    
    var bonus = sheetCCListValues[i][1].replace('−', '-').replace(/[^\x20-\xFF]+/g, '').toString();
    var type = sheetCCListValues[i][0].replace('−', '-').replace(/[^\x20-\xFF]+/g, '').toString();
    
    var cell = {};
    
    if(type === "9 céréales")
    {
      cell['type'] = "9cc";
      
      if(bonus === "+‭150‬%‬")
        cell['color'] = green9cc[0];
      else if(bonus === "+‭125‬%‬")
        cell['color'] = green9cc[1];
      else if(bonus === "+‭100‬%‬")
        cell['color'] = green9cc[2];
      else if(bonus === "+‭75‬%‬")
        cell['color'] = green9cc[3];
      else if(bonus === "+‭50%‬")
        cell['color'] = green9cc[3];
      else
        cell['color'] = green9cc[3];
    }
    else
    {
      cell['type'] = "15cc";
      
      if(bonus === "+‭150‬%‬")
        cell['color'] = red15cc[0];
      else if(bonus === "+‭125%‬")
        cell['color'] = red15cc[1];
      else if(bonus === "+‭100‬%‬")
        cell['color'] = red15cc[2];
      else if(bonus === "+‭75‬%‬")
        cell['color'] = red15cc[3];
      else if(bonus === "+‭50%‬")
        cell['color'] = red15cc[3];
      else
        cell['color'] = red15cc[3];
    }
    
    cell['bonus'] = bonus; 
    cell['x'] = coordsArray[0];
    cell['y'] = coordsArray[1];
    updateCell(cell);
  }
  /*colorizedCell(-20, -20, "red");
  colorizedCell(-60, -60, "orange");*/
}

function updateCell(c)
{
  colorizedCell(c['x'], c['y'], c['color']);
  labelCell(c['x'], c['y'], c['type']+" " + c['bonus']);
}

function colorizedCell(x, y, color)
{
  var x_range = 6-x;
  var y_range = 202+y;
  
  Logger.log(color);
  
  if(x_range >= 0 && y_range >= 0)
    sheetMap.getRange(x_range, y_range).setBackground(color);
  
  /*(0, 0) = (6, CY) = (6, 101)
  (-1, -1) = (7, CX) = (7, 100)
  (-50, -50) = 6-(-50), 101+-50*/
}

function labelCell(x, y, tag)
{
  var x_range = 6-x;
  var y_range = 202+y;
  
  if(x_range >= 0 && y_range >= 0)
  {
    sheetMap.getRange(x_range, y_range).setValue("("+x+","+y+") = " + tag);
    sheetMap.getRange(x_range, y_range).setFontSize(1)
  }
}
