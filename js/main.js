const VERSION = 0.1;

let curModule;
let curModuleName = '';
let selectedQuest = -1;


class Question {
    constructor() {
        this.answer = '';
        this.question = '';
        this.rightAnswered = 0;
        this.wrongAnswered = 1;
        this.wrongAnswers = ['', '', ''];
    }
}

class Module {
    constructor(v = VERSION) {
        this.requiredVersion = v;
        this.questions = [];
    }
}

window.onload = ()=>{

    const DOM = {
        uploadForm: document.getElementById('js-upload-form'),
        dropZone: document.getElementById('drop-zone'),
        jsUploadFiles: document.getElementById('jsUploadFiles'),

        quest: document.getElementById('quest'),
        answer: document.getElementById('answer'),
        wrong1: document.getElementById('wrong1'),
        wrong2: document.getElementById('wrong2'),
        wrong3: document.getElementById('wrong3'),

        questInput: document.getElementById('questInput'),

        questions: document.getElementById('questions'),
        modName: document.getElementById('modName'),
    }


    DOM.questInput.addEventListener('submit', e => {
        e.preventDefault();

        if (DOM.quest.value.length === 0 ||
            DOM.answer.value.length === 0 ||
            DOM.wrong1.value.length === 0 ||
            DOM.wrong2.value.length === 0 ||
            DOM.wrong3.value.length === 0) {
            return;
        }

        let q;
        if (!curModule) {
            curModule = new Module();
        } 
        if ( selectedQuest === -1) {
            q = new Question();
            curModule.questions.push(q);
        } else if (selectedQuest !== -1) {
            q = curModule.questions[selectedQuest];
        }

        q.question = DOM.quest.value;
        q.answer = DOM.answer.value;
        q.wrongAnswers[0] = DOM.wrong1.value;
        q.wrongAnswers[1] = DOM.wrong2.value;
        q.wrongAnswers[2] = DOM.wrong3.value;

        DOM.quest.value = null;
        DOM.answer.value = null;
        DOM.wrong1.value = null;
        DOM.wrong2.value = null;
        DOM.wrong3.value = null;

        selectedQuest = -1;

        updateQuestSelector();
    });

    window.save = () => {
        if (!curModule){
            return;
        }
        curModuleName = DOM.modName.value;
        console.log(curModule);
        downloadObjectAsJson(curModule, curModuleName);
    }

    const startUpload = (files) => {
        if (files.length !== 1){
            console.log('Please select exactly one file!');
            return;
        }


        const fr = new FileReader();

        fr.onload = e => {
            
            if (curModule && !confirm('Möchtest du wirklich ein neues Modul laden? Änderungen am alten Modul werden verworfen!')){
                return;
            }
            
            updateQuestSelector(JSON.parse(e.target.result), files[0].name );

            // const formatted = JSON.stringify(curModule, null, 2);
        }

        fr.readAsText(files.item(0));
    }

    function updateQuestSelector(mod = curModule, name = curModuleName) {

        curModuleName = name;
        curModule = mod;
        DOM.questions.innerHTML = '';

        DOM.modName.value = name.substr(0, name.length-5);
        curModule.questions.forEach((quest, ind) => {
            DOM.questions.innerHTML += getHTMLfromQuest(quest, ind);
        });

    }

    function getHTMLfromQuest(quest, ind) {

        return '<button class="btn btn-default questLink" onclick="openQuest(' + ind + ')">' + quest.question + '</button><br>';

    }

    window.openQuest = (ind) => {
        selectedQuest = ind;

        const q = curModule.questions[ind];
        DOM.quest.value = q.question;
        DOM.answer.value = q.answer;
        DOM.wrong1.value = q.wrongAnswers[0];
        DOM.wrong2.value = q.wrongAnswers[1];
        DOM.wrong3.value = q.wrongAnswers[2];
        
    }

    DOM.uploadForm.addEventListener('submit', e => {
        const uploadFiles = DOM.jsUploadFiles.files;
        e.preventDefault();

        startUpload(uploadFiles);
    });

    DOM.dropZone.ondrop = e => {
        e.preventDefault();
        DOM.dropZone.className = 'upload-drop-zone';

        startUpload(e.dataTransfer.files);
    }

    DOM.dropZone.ondragover = () => {
        DOM.dropZone.className = 'upload-drop-zone drop';
        return false;
    }

    DOM.dropZone.ondragleave = () => {
        DOM.dropZone.className = 'upload-drop-zone';
        return false;
    }




    function downloadObjectAsJson(exportObj, exportName) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 4));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

}