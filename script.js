let sampleData = [
  {
    id: 1,
    dateTime: "28 Nov 2025, 10:30 AM",
    text: "Buy groceries for the week and prep meal plan."
  },
  {
    id: 2,
    dateTime: "29 Nov 2025, 02:15 PM",
    text: "Record voice note idea: daily routine tracker using JS."
  },
  {
    id: 3,
    dateTime: "30 Nov 2025, 08:45 AM",
    text: "Call mentor and discuss placement prep strategy."
  }
];

if (!localStorage.getItem('notesData')) {
  localStorage.setItem('notesData', JSON.stringify(sampleData));
} else {
  const existingData = JSON.parse(localStorage.getItem('notesData'));
  sampleData = existingData;
}

function createListItem(note) {
// <li class="notesListItem">
//   <div class="noteActionsContainer">
//     <small class="noteDate">28 Nov 2025, 10:30 AM</small>
//     <div class="noteActions">
//       <button class="editBtn"><i class="fas fa-edit"></i></button>
//       <button class="saveBtn" disabled><i class="fa-solid fa-floppy-disk"></i></button>
//       <button class="deleteBtn"><i class="fas fa-trash-alt"></i></button>
//     </div>
//   </div>
//   <div class="noteContent">
//     <p class="noteText">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis deleniti fugit minus vel quas aspernatur impedit nulla hic in illum optio saepe fuga quaerat aliquid dolorem alias, itaque excepturi quo.</p>
//   </div>
// </li>
  const li = document.createElement('li');
  li.classList.add('notesListItem');
  li.dataset.id = note.id;

  const noteActionsContainer = document.createElement('div');
  noteActionsContainer.classList.add('noteActionsContainer');

  const noteDate = document.createElement('small');
  noteDate.classList.add('noteDate');
  noteDate.textContent = note.dateTime;

  const noteActions = document.createElement('div');
  noteActions.classList.add('noteActions');

  const editBtn = document.createElement('button');
  editBtn.classList.add('editBtn');
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';

  const saveBtn = document.createElement('button');
  saveBtn.classList.add('saveBtn');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

  noteActions.appendChild(editBtn);
  noteActions.appendChild(saveBtn);
  noteActions.appendChild(deleteBtn);

  noteActionsContainer.appendChild(noteDate);
  noteActionsContainer.appendChild(noteActions);

  const noteContent = document.createElement('div');
  noteContent.classList.add('noteContent');

  const noteText = document.createElement('p');
  noteText.classList.add('noteText');
  noteText.textContent = note.text;

  noteContent.appendChild(noteText);

  li.appendChild(noteActionsContainer);
  li.appendChild(noteContent);

  return li;
}

function updateLocalStorage(id) {
  const notesData = JSON.parse(localStorage.getItem('notesData'));
  const updatedNotesData = notesData.filter(note => note.id !== id);
  localStorage.setItem('notesData', JSON.stringify(updatedNotesData));
}

function UpdateNoteListItems() {
  const notesListItem = document.querySelectorAll('.notesListItem');

  notesListItem.forEach(item => {
    const noteText = item.querySelector('.noteText');
    const editBtn = item.querySelector('.editBtn');
    const saveBtn = item.querySelector('.saveBtn');
    const deleteBtn = item.querySelector('.deleteBtn');
    
    noteText.addEventListener('click', () => {
      noteText.classList.toggle('expanded');
    });

    editBtn.addEventListener('click', () => {
      const noteText = item.querySelector('.noteText');
      const textArea = document.createElement('textarea');
      textArea.classList.add('noteText');
      textArea.value = noteText.textContent;

      noteText.classList.remove('expanded');
      noteText.replaceWith(textArea);

      textArea.classList.add('textAreaActive');
      saveBtn.disabled = false;
      editBtn.disabled = true;
    });

    saveBtn.addEventListener('click', () => {
      const textArea = item.querySelector('textarea');

      const newP = document.createElement('p');
      newP.classList.add('noteText');
      newP.textContent = textArea.value.trim();

      textArea.classList.remove('textAreaActive');

      textArea.replaceWith(newP);
      saveBtn.disabled = true;
      editBtn.disabled = false;

      newP.addEventListener('click', () => {
        newP.classList.toggle('expanded');
      });

      const id = parseInt(item.dataset.id);
      const notesData = JSON.parse(localStorage.getItem('notesData'));
      const note = notesData.find(n => n.id === id);
      note.text = newP.textContent;
      localStorage.setItem('notesData', JSON.stringify(notesData));
    });

    deleteBtn.addEventListener('click', () => {
      updateLocalStorage(parseInt(item.dataset.id));
      item.remove();
    });
  });
}

function initializeNotes() {
  const notesData = JSON.parse(localStorage.getItem('notesData'));

  const notesLists = document.querySelectorAll('.notesList');

  notesLists.forEach(list => list.innerHTML = '');

  notesLists.forEach(list => {
    list.innerHTML = '';
    notesData.forEach(note => {
      const listItem = createListItem(note);
      list.appendChild(listItem);  
    });
  });

  UpdateNoteListItems();
}
initializeNotes();


const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.continuous = true;


let activeEditNote = null;
const mic = document.getElementById('mic');
mic.addEventListener('click', () => {
  activeEditNote = true;
  if(activeEditNote) {
    const newNotePreviewContainers = document.querySelectorAll('.newNotePreviewContainer');
    newNotePreviewContainers.forEach(container => {
      container.classList.remove('hide');
    });
    recognition.start();
    recognition.onstart = () => {
      finalTranscript = "";
    };

    console.log('Voice recognition started. Speak into the microphone.');
  }
});

recognition.onresult = (event) => {
  const newNotePreviewTexts = document.querySelectorAll('.newNotePreviewText');
  const newNoteSaveBtns = document.querySelectorAll('.newNoteSaveBtn');
  newNoteSaveBtns.forEach(btn => {
    btn.disabled = false;
  });
  const transcript = Array.from(event.results)
    .map(result => result[0].transcript)
    .join(' ');
  if (activeEditNote) {    
    newNotePreviewTexts.forEach(textElement => {
      textElement.textContent = transcript;
    });
    console.log('Transcribed Text:', transcript);
  }
}

const newNoteSaveBtn = document.querySelectorAll('.newNoteSaveBtn');
newNoteSaveBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    const notesData = JSON.parse(localStorage.getItem('notesData'));
    const newNotePreviewTexts = document.querySelectorAll('.newNotePreviewText');
    
    const id = Date.now();
    const dateTime = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    const text = newNotePreviewTexts[0].textContent.trim();
    let newNote = { id, dateTime, text };
    notesData.push(newNote);
    localStorage.setItem('notesData', JSON.stringify(notesData));
    initializeNotes();

    const newNotePreviewContainers = document.querySelectorAll('.newNotePreviewContainer');
    // newNotePreviewText.textContent = 'Speak now...';
    newNotePreviewContainers.forEach(container => {
      container.classList.add('hide');
    });
     newNotePreviewTexts.forEach(textElement => {
      textElement.textContent = 'Speak now...';
    });
    activeEditNote = null;
    recognition.stop();
    console.log('Voice recognition stopped.');
});

});



const newNoteCancelBtns = document.querySelectorAll('.newNoteCancelBtn');
newNoteCancelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const newNotePreviewContainers = document.querySelectorAll('.newNotePreviewContainer');
    const newNotePreviewTexts = document.querySelectorAll('.newNotePreviewText');
    
    newNotePreviewContainers.forEach(container => {
      container.classList.add('hide');
    });
    newNotePreviewTexts.forEach(textElement => {
      textElement.textContent = 'Speak now...';
    });
    activeEditNote = null;
    recognition.stop();
    console.log('Voice recognition stopped.');
  });
});