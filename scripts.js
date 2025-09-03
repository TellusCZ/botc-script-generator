async function loadRoles() {
      try {
        const response = await fetch('botc/roles.json');
        if (!response.ok) {
          throw new Error('Soubor roles.json nelze nacíst. Zkontrolujte, že se nachází ve stejné složce jako HTML.');
        }
        const data = await response.json();
        document.getElementById("rolesJson").value = JSON.stringify(data, null, 2);
      } catch (e) {
        alert("Chyba pri nacítání roles.json: " + e.message);
      }
    }

async function loadRolesCZ() {
      try {
        const response = await fetch('botc/rolescz.json');
        if (!response.ok) {
          throw new Error('Soubor roles.json nelze nacíst. Zkontrolujte, že se nachází ve stejné složce jako HTML.');
        }
        const data = await response.json();
        document.getElementById("rolesJson").value = JSON.stringify(data, null, 2);
      } catch (e) {
        alert("Chyba pri nacítání roles.json: " + e.message);
      }
      try {
        const response = await fetch('botc/nightsheet.json');
        if (!response.ok) {
          throw new Error('Soubor roles.json nelze nacíst. Zkontrolujte, že se nachází ve stejné složce jako HTML.');
        }
        const data = await response.json();
        document.getElementById("nightOrderSheet").value = JSON.stringify(data, null, 2);
      } catch (e) {
        alert("Chyba pri nacítání roles.json: " + e.message);
      }
      try {
        const response = await fetch('botc/nightordercz.json');
        if (!response.ok) {
          throw new Error('Soubor roles.json nelze nacíst. Zkontrolujte, že se nachází ve stejné složce jako HTML.');
        }
        const data = await response.json();
        document.getElementById("nightOrderTmp").value = JSON.stringify(data, null, 2);
      } catch (e) {
        alert("Chyba pri nacítání roles.json: " + e.message);
      }
    }

function TranslateScript() {
  try {
    const scriptText = document.getElementById("scriptJson").value;
    const rolesText = document.getElementById("rolesJson").value;

    let scriptRaw = JSON.parse(scriptText);
    let rolesRaw = JSON.parse(rolesText);

    // Normalizace vstupu rolesRaw na pole objektu s id
    const roles = rolesRaw.map(item => {
      if (typeof item === "string") {
        return { id: item };
      } else {
        return item;
      }
    });

    const rolesMap = {};
    roles.forEach(role => {
      if (role.id) {
        rolesMap[role.id] = role;
      }
    });

    // Normalizace vstupu scriptRaw na pole objektu s id
    const script = scriptRaw.map(item => {
      if (typeof item === "string") {
        return { id: item };
      } else {
        return item;
      }
    });

    // Normální preklad (translatedScriptJson)
    const translated = script.map(entry => {
  if (!entry.id) return entry;
  const roleData = rolesMap[entry.id];
  if (roleData) {
    const { image, ...rest } = roleData; // odstranení "image"
    return { ...rest };
  } else {
    return entry;
  }
});

    // CZ preklad (translatedScriptCZ)
    const translatedCZ = script.map(entry => {
      if (!entry.id) return entry;
      const roleData = rolesMap[entry.id];
      if (roleData) {
        const newEntry = { ...roleData };
        newEntry.id = entry.id + "cz";
        return newEntry;
      } else {
        return entry;
      }
    });

    // Výstupy do textových polí
    document.getElementById("translatedScriptJson").value = JSON.stringify(translated, null, 2);
    document.getElementById("translatedScriptCZ").value = JSON.stringify(translatedCZ, null, 2);

  } catch (e) {
    alert("Chyba pri parsování JSONu: " + e.message);
  }
}

function saveJsonFromElement(elementId, defaultFilename = "download.json") {
  const dataStr = document.getElementById(elementId).value;
  if (!dataStr) {
    alert("Nejprve vygeneruj data pro uložení.");
    return;
  }

  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = defaultFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 
    function formatRoles( rolesArray )
    {
      let html = '';
      rolesArray.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img height='30px' width='' class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
          return html;
        });
    }
function generateScript() {
      /*const req = new XMLHttpRequest();
      req.open('GET', '/json/cats.json', true);
      req.send();
      req.onload = function () {
        const json = JSON.parse(req.responseText);
        let html = '';
        json.forEach(function (val) {
          html += "<div class = 'cat'>";
          // Add your code below this line

          // Add your code above this line
          html += '</div><br>';
        });
        document.getElementsByClassName('message')[0].innerHTML = html;
      };*/
      TranslateScript();
const scriptText = document.getElementById("translatedScriptCZ").value;
const json = JSON.parse(scriptText);
let html = '';
let countOfTownsfolk = 0;
let countOfOutsiders = 0;
let countOfMinions = 0;
let countOfDemons = 0;
json.forEach(function (val) {
  if (val.team == "townsfolk")
    countOfTownsfolk +=1;
  if (val.team == "outsider")
    countOfOutsiders +=1;
  if (val.team == "demon")
    countOfDemons +=1;
  if (val.team == "minion")
    countOfMinions +=1;
});

var linesForTownsfolk = Math.round(countOfTownsfolk / 2);
var linesForOutsiders = Math.round(countOfOutsiders / 2);
var linesForMinions = Math.round(countOfMinions / 2);
var linesForDemons = Math.round(countOfDemons / 2);

var TotalLines = linesForTownsfolk + linesForOutsiders + linesForMinions + linesForDemons;

var townsfolkArray = json.slice(1, countOfTownsfolk + 1);
var townsfolkArrayOne = json.slice(1, Math.round(countOfTownsfolk / 2) + 1);
var townsfolkArrayTwo = json.slice( Math.round(countOfTownsfolk / 2) + 1, countOfTownsfolk + 1);
var OutsidersArray = json.slice(countOfTownsfolk + 1, countOfTownsfolk + countOfOutsiders + 1);
var outsidersArrayOne = json.slice(countOfTownsfolk + 1, countOfTownsfolk + Math.round(countOfOutsiders / 2) + 1);
var outsidersArrayTwo = json.slice(countOfTownsfolk + Math.round(countOfOutsiders / 2) + 1, countOfTownsfolk + countOfOutsiders + 1);
var MinionsArray = json.slice(countOfTownsfolk + countOfOutsiders + 1, countOfTownsfolk + countOfOutsiders + countOfMinions + 1);
var minionsArrayOne = json.slice(countOfTownsfolk + countOfOutsiders + 1, countOfTownsfolk + countOfOutsiders + Math.round(countOfMinions / 2) + 1);
var minionsArrayTwo = json.slice(countOfTownsfolk + countOfOutsiders + Math.round(countOfMinions / 2) + 1, countOfTownsfolk + countOfOutsiders + countOfMinions + 1);
var DemonsArray = json.slice(countOfTownsfolk + countOfOutsiders + countOfMinions + 1);
var demonsArrayOne = json.slice(countOfTownsfolk + countOfOutsiders + countOfMinions + 1, countOfTownsfolk + countOfOutsiders + countOfMinions + Math.round(countOfDemons / 2) + 1);
var demonsArrayTwo = json.slice(countOfTownsfolk + countOfOutsiders + countOfMinions + Math.round(countOfDemons / 2) + 1);


html += "<div id='script' class='script'>";
html += "<div class='scriptname'><img class='scriptlogo' src='botc/scriptlogov2.png'>" + json[0].name + "</div>";
//html += countOfTownsfolk + "(" + Math.round(countOfTownsfolk / 2) + ")" + "-" + countOfOutsiders + "-" + countOfMinions + "-" + countOfDemons;
html += "<img class='separator' src='botc/separator-townsfolk.png'>"
html += "<div class='townsfolk' height='" + 640 + "'>";
html += "<div>";
townsfolkArrayOne.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "<div>";
townsfolkArrayTwo.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "</div>"; //end of townsfolk
        html += "<img class='separator' src='botc/separator-outsider.png'>"
html += "<div class='outsider' height='" + 160 + "'>";
html += "<div>";
outsidersArrayOne.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "<div>";
outsidersArrayTwo.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "</div>"; //end of outsider
        html += "<img class='separator' src='botc/separator-minions.png'>"
html += "<div class='minion' height='" + 160 + "'>";
html += "<div>";
minionsArrayOne.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "<div>";
minionsArrayTwo.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "</div>"; //end of minions
        html += "<img class='separator' src='botc/separator-demons.png'>"
html += "<div class='minion' height='" + 160 + "'>";
html += "<div>";
demonsArrayOne.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "<div>";
demonsArrayTwo.forEach(function (val) {
          html += "<div class = 'role'>";
          // Add your code below this line
          html += "<img class='roleikon' src = '" + val.image + "''>";
          html += "<p class='roledescription' ";
          if (val.team == "townsfolk" || val.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + val.name + "<br>";
          html += "<span class='roledetail'>" + val.ability + "</span></p>"
          // Add your code above this line
          html += '</div><br>';
        });
        html += "</div>"; //end of column
        html += "</div>"; //end of demons
        html += "</div>"; //end of script
        html = html.replaceAll("Each night", "<b>Each night</b>");
        html = html.replaceAll("Each night*", "<b>Each night-</b>");
        html = html.replaceAll("Každou noc", "<b>Každou noc</b>");
        html = html.replaceAll("Každou noc*", "<b>Každou noc*</b>");
        html = html.replaceAll("Jednou za hru, v noci", "<b>Jednou za hru, v noci</b>");
        html = html.replaceAll("Zacínáš s informací", "<b>Zacínáš s informací</b>");
        document.getElementsByClassName('message')[0].innerHTML = html;
    }



    function testSetup(){
      document.getElementById("scriptJson").value = '[{"id":"_meta","author":"Petr","name":"No one is safe"},"clockmaker","investigator","bountyhunter","villageidiot","fortuneteller","lycanthrope","towncrier","amnesiac","poppygrower","alchemist","minstrel","virgin","banshee","mutant","drunk","lunatic","snitch","godfather","boffin","poisoner","fearmonger","imp","fanggu","nodashii","kazali"]';
      //document.getElementById("scriptJson")[0].innerHTML = "[{'id:'_meta','author':'Petr','name':'No one is safe"},"clockmaker","investigator","bountyhunter","villageidiot","fortuneteller","lycanthrope","towncrier","amnesiac","poppygrower","alchemist","minstrel","virgin","banshee","mutant","drunk","lunatic","snitch","godfather","boffin","poisoner","fearmonger","imp","fanggu","nodashii","kazali"]";
      loadRolesCZ();
      //TranslateScript();
      //generateScript();
    }
  
/*function putImage()
{
  var canvas1 = document.getElementById("canvasSignature");        
  if (canvas1.getContext) {
     var ctx = canvas1.getContext("2d");                
     var myImage = canvas1.toDataURL("image/png");      
  }
  var imageElement = document.getElementById("MyPix");  
  imageElement.src = myImage;                           

}  */

function generateNightOrder() {

const scriptText = document.getElementById("translatedScriptCZ").value;
const scriptJson = JSON.parse(scriptText);

const nightOrderTmp = document.getElementById("nightOrderTmp").value;
const nightOrderJsonTmp = JSON.parse(nightOrderTmp);
      
const nightOrder = document.getElementById("nightOrderSheet").value;
const json = JSON.parse(nightOrder);
/*try {
        const response = await fetch('botc/nightsheet.json');
        if (!response.ok) {
          throw new Error('Soubor roles.json nelze nacíst. Zkontrolujte, že se nachází ve stejné složce jako HTML.');
        }
        const data = await response.json();
        var nightOrderString = JSON.stringify(data, null, 2);
      } catch (e) {
        alert("Chyba pri nacítání roles.json: " + e.message);
      }*/

let html = '';
//json.forEach(function (val) {
  html += "<div class='nightorder'>";
  html += "<div class='scriptname'>" + "První noc" + "</div>";
  /*val.firstNight.forEach( function (role) {
    html += "<div>" + role + "</div>";
  });*/
  json.firstNight.forEach(function (val) {
    
    if(['DAWN','DUSK','DEMON','MINION'].includes(val)) {
       nightOrderJsonTmp.forEach(function (tmp) {
         if( val == tmp.id ){
           html += "<div class='orderrole'>" ;
           html += "<img class='tmpikon' src = '" + tmp.image + "''>";
           html += "<p class='nightroledescription' ";
           html += ">" + tmp.name + "<br>";
           html += "<span class='nightdetail'>" + tmp.firstNightReminder + "</span></p>"
           html += "</div>";
         }
       });
    }
    else
    {
      //html += "<div class='orderrole'>" + val + "</div>";
      scriptJson.forEach(function (role) {
        
        //html += "<div class='orderrole'>" + role.id +"/" + val + "</div>";
        if( role.id == ( val + "cz" ) ){
          html += "<div class='orderrole'>" ;
          html += "<img class='nightikon' src = '" + role.image + "''>";
          html += "<p class='nightroledescription' ";
          if (role.team == "townsfolk" || role.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + role.name + "<br>";
          html += "<span class='nightdetail'>" + role.firstNightReminder + "</span></p>"
          html += "</div>";
        }
      });
    }
    //html += "<div>" + val + "</div>";
  });
  html += "</div>";
  document.getElementsByClassName('FirstNightOrderImage')[0].innerHTML = html;

  html = '';
//json.forEach(function (val) {
  html += "<div class='nightorder'>";
  html += "<div class='scriptname'>" + "Další noci" + "</div>";
  /*val.firstNight.forEach( function (role) {
    html += "<div>" + role + "</div>";
  });*/
  json.otherNight.forEach(function (val) {
    
    if(['DAWN','DUSK','DEMON','MINION'].includes(val)) {
       nightOrderJsonTmp.forEach(function (tmp) {
         if( val == tmp.id ){
           html += "<div class='orderrole'>" ;
           html += "<img class='tmpikon' src = '" + tmp.image + "''>";
           html += "<p class='nightroledescription' ";
           html += ">" + tmp.name + "<br>";
           html += "<span class='nightdetail'>" + tmp.otherNightReminder + "</span></p>"
           html += "</div>";
         }
       });
    }
    else
    {
      //html += "<div class='orderrole'>" + val + "</div>";
      scriptJson.forEach(function (role) {
        
        //html += "<div class='orderrole'>" + role.id +"/" + val + "</div>";
        if( role.id == ( val + "cz" ) ){
          html += "<div class='orderrole'>" ;
          html += "<img class='nightikon' src = '" + role.image + "''>";
          html += "<p class='nightroledescription' ";
          if (role.team == "townsfolk" || role.team == "outsider")
            html += "style='color:blue;'";
          else
            html += "style='color:red;'";
          html += ">" + role.name + "<br>";
          html += "<span class='nightdetail'>" + role.otherNightReminder + "</span></p>"
          html += "</div>";
        }
      });
    }
    //html += "<div>" + val + "</div>";
  });
  html += "</div>";
  document.getElementsByClassName('OtherNightOrderImage')[0].innerHTML = html;
//});
}

document.getElementById('savePng').addEventListener('click', () => {
    const element = document.getElementById('captureThis');

    html2canvas(element, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'export.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });







