// Sample data to initialize localStorage if empty
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

// Initialize localStorage with sample data if empty
if (!localStorage.getItem('notesData')) {
  localStorage.setItem('notesData', JSON.stringify(sampleData));
} else {
  const existingData = JSON.parse(localStorage.getItem('notesData'));
  sampleData = existingData;
}

// Function to create a note list item
function createListItem(note) {
// Example HTML structure:
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

// Function to update localStorage when a note is deleted
function updateLocalStorage(id) {
  const notesData = JSON.parse(localStorage.getItem('notesData'));
  const updatedNotesData = notesData.filter(note => note.id !== id);
  localStorage.setItem('notesData', JSON.stringify(updatedNotesData));
}

// Function to add event listeners to note list items
function UpdateNoteListItems() {
  // Get all note list items
  const notesListItem = document.querySelectorAll('.notesListItem');

  // Add event listeners to each note list item
  notesListItem.forEach(item => {
    const noteText = item.querySelector('.noteText');     // Paragraph element
    const editBtn = item.querySelector('.editBtn');       // Edit button
    const saveBtn = item.querySelector('.saveBtn');       // Save button
    const deleteBtn = item.querySelector('.deleteBtn');   // Delete button
    
    // Toggle expanded class on note text click to expand/collapse note text card
    noteText.addEventListener('click', () => {
      noteText.classList.toggle('expanded');
    });

    // Edit button click event handler to switch to textarea for editing note text card
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

    // Save button click event handler to save edited note text and update localStorage
    saveBtn.addEventListener('click', () => {
      // Get the active textarea element created during edit
      const textArea = item.querySelector('textarea');

      // Create a new paragraph element to replace the textarea
      const newP = document.createElement('p');
      newP.classList.add('noteText');                     // Set class for styling
      newP.textContent = textArea.value.trim();           // Set the updated text content     

      // Remove textarea active class
      textArea.classList.remove('textAreaActive');

      // Replace textarea with the new paragraph element
      textArea.replaceWith(newP);
      saveBtn.disabled = true;       // Disable save button after saving
      editBtn.disabled = false;      // Enable edit button after saving

      // Add click event listener to new paragraph to toggle expanded class
      newP.addEventListener('click', () => {
        newP.classList.toggle('expanded');
      });

      // Update localStorage with the new note text
      const id = parseInt(item.dataset.id);
      const notesData = JSON.parse(localStorage.getItem('notesData'));
      const note = notesData.find(n => n.id === id);
      note.text = newP.textContent;
      notesData[id] = note;
      localStorage.setItem('notesData', JSON.stringify(notesData));
    });

    // Delete button click event handler to delete note and update localStorage
    deleteBtn.addEventListener('click', () => {
      updateLocalStorage(parseInt(item.dataset.id));
      item.remove();
    });
  });
}

// Function to initialize notes from localStorage and render them
function initializeNotes() {
  // Get notes data from localStorage
  const notesData = JSON.parse(localStorage.getItem('notesData'));

  // Get all notes list containers
  const notesLists = document.querySelectorAll('.notesList');

  // Clear existing notes in all lists
  notesLists.forEach(list => list.innerHTML = '');

  // Populate notes in all lists
  notesLists.forEach(list => {
    notesData.forEach(note => {
      const listItem = createListItem(note);
      list.appendChild(listItem);  
    });
  });

  // Add event listeners to note list items
  UpdateNoteListItems();
}

// Initialize notes on page load
initializeNotes();


// Speech Recognition Setup
const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';          // Set language to English (US)
recognition.interimResults = true;   // Enable interim results for real-time transcription
recognition.continuous = true;       // Keep recognition active until stopped manually

// Variable to track if a note is being edited
let activeEditNote = null;
// Variable to store final transcript
const mic = document.getElementById('mic');
// Event listener for microphone button click to start voice recognition
mic.addEventListener('click', () => {
  activeEditNote = true;
  if(activeEditNote) {
    // Show new note preview container and start recognition
    const newNotePreviewContainers = document.querySelectorAll('.newNotePreviewContainer');
    newNotePreviewContainers.forEach(container => {
      container.classList.remove('hide');
    });

    // Start speech recognition
    recognition.start();
    recognition.onstart = () => {
      finalTranscript = "";
    };

    // Log message indicating that recognition has started
    console.log('Voice recognition started. Speak into the microphone.');
  }
});

// Event listener for speech recognition results
recognition.onresult = (event) => {
  // Get all new note preview text elements and save buttons
  const newNotePreviewTexts = document.querySelectorAll('.newNotePreviewText');
  const newNoteSaveBtns = document.querySelectorAll('.newNoteSaveBtn');

  // Enable save buttons when there is a result
  newNoteSaveBtns.forEach(btn => {
    btn.disabled = false;
  });

  // Compile the transcript from the recognition results
  const transcript = Array.from(event.results)
    .map(result => result[0].transcript)
    .join(' ');

  // Update the new note preview text elements with the transcript
  if (activeEditNote) {    
    // there is two newNotePreviewText like one for small screen and one for large screen thats why using forEach to update both
    newNotePreviewTexts.forEach(textElement => {
      textElement.textContent = transcript;
    });

    // Log the transcribed text for debugging
    console.log('Transcribed Text:', transcript);
  }
}

// Event listener for newNotePreviewContainer click to save the new note
const newNoteSaveBtn = document.querySelectorAll('.newNoteSaveBtn');
// because of two newNotePreviewContainer one for small screen and one for large screen we are using forEach to add event listener to both
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



// Event listener for newNoteCancelBtn click to cancel the new note, Also foreach used because of two buttons for small and large screens
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