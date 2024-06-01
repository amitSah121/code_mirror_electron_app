// Create an initial state for the view
const initialState = cm6.createEditorState("Load Something to edit.........");
const view = cm6.createEditorView(initialState, document.getElementById("editor"));
let states = { "Initial State": initialState };

// document.querySelector("#tab1").addEventListener("click",()=>{
//     view.dispatch({changes: {
//         from: 0,
//         to: view.state.doc.length,
//         insert: 'my new content'
//     }})
// });


let paths = []
let filenames = []
let datas = []
document.querySelector("#menu-open-file").addEventListener("click",async ()=>{
    const data = await window.openAPI.getContent();
    paths.push(data.split("+")[0]);
    datas.push(data.substring(paths[paths.length-1].length+1));
    filenames.push(paths[paths.length-1].substring(paths[paths.length-1].lastIndexOf('/')+1));
    let tabs = document.querySelector("#open-tabs");
    w3.removeClass("#open-tabs span","w3-grey");
    w3.addClass("#open-tabs span","w3-white w3-text-black");
    tabs.innerHTML = tabs.innerHTML+`<span class="w3-bar-item w3-grey w3-text-white w3-small" id="tab1">${filenames.length} ${filenames[filenames.length-1]}</span>`;
    view.dispatch({
        changes:{
            from:0,
            to: view.state.doc.length,
            insert: datas[datas.length-1]
        }
    });
    document.querySelector("#open-tabs").addEventListener("click",(event)=>{
        let temp = document.querySelector("#open-tabs .w3-grey");
        w3.removeClass("#open-tabs span","w3-grey w3-text-white");
        w3.addClass("#open-tabs span","w3-white w3-text-black");
        w3.removeClass(event.target,"w3-white w3-text-black");
        w3.addClass(event.target,"w3-grey w3-text-white");
        datas[temp.innerHTML.split(" ")[0]-1] = view.state.doc.toString();
        view.dispatch({
            changes:{
                from:0,
                to: view.state.doc.length,
                insert: datas[event.target.innerHTML.split(" ")[0]-1]
            }
        });
    });
})