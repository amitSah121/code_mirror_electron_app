const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require("node:path");
const fs = require("fs");
var exec = require('child_process').exec;



async function handleFileOpenAndContent(){
    const {canceled, filePaths} = await dialog.showOpenDialog();
    if(!canceled){
        
        return `${filePaths[0]}+${fs.readFileSync(filePaths[0]).toString()}`;
    }
    return "nothing";
}

function runTerminal(event,command){
    exec(command, function(error, stdout, stderr){ 
        fs.writeFileSync('./terminal_output.txt', stdout, err => {
            if (err) {
              console.error(err)
              return;
            }
          })
     });
     return "failed";
};

function readTerminalOutput(){
    return fs.readFileSync("./terminal_output.txt").toString();
    // return "Hello";
}

function writeFile(event, filepath, data){
    console.log(filepath, data);
    fs.writeFileSync(filepath, data, err => {
        if (err) {
            console.error(err)
            return;
        }
    })
}

// module.exports.getGitUser = function(callback){
//     execute("git config --global user.name", function(name){
//         execute("git config --global user.email", function(email){
//             callback({ name: name.replace("\n", ""), email: email.replace("\n", "") });
//         });
//     });
// };

const createWindow = ()=>{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname,'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    win.loadFile("index.html");
    win.setMenu(null);
    // win.webContents.openDevTools();
}

app.whenReady().then(()=>{
    ipcMain.handle("dialog:openFile",handleFileOpenAndContent);
    ipcMain.handle("runTerminal",runTerminal);
    ipcMain.handle("readTerminalOutput",readTerminalOutput);
    ipcMain.handle("writeFile",writeFile);

    createWindow();

    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length == 0) createWindow();
    });
});

app.on('window-all-closed', ()=>{
    if(process.platform != 'darwin') app.quit();
});