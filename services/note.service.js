import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const NOTES_KEY = 'notesDB'

// TODO - update gFilterBy & gSortBy
var gFilterBy = { txt: 'PLACEHOLDER' }
var gSortBy = { txt: 'PLACEHOLDER' }
var gPageIdx

_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getNextNoteId,
    getFilterBy,
    setFilterBy,
    _createNote,
    getEmptyNote,
}
window.noteService = noteService

function query() {
    return storageService.query(NOTES_KEY).then(notes => {
        // if (gFilterBy.txt) {
        //     const regex = new RegExp(gFilterBy.txt, 'i')
        //     notes = notes.filter(notes => regex.test(notes.date))
        // }

        // if (gPageIdx !== undefined) {
        //     const startIdx = gPageIdx * PAGE_SIZE
        //     notes = notes.slice(startIdx, startIdx + PAGE_SIZE)
        // }
        // else if (gSortBy.txt !== undefined) {
        //     notes.sort(
        //         (c1, c2) => c1.date.localeCompare(c2.date) * gSortBy.date
        //     )
        // }
        console.log('notes:', notes)
        return notes
    })
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
        .then(note => _setNextPrevNoteId(note))
}

function _setNextPrevNoteId(note) {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            const noteIdx = notes.findIndex(currNote => currNote.id === note.id)
            note.nextNoteId = notes[noteIdx + 1] ? notes[notedIdx + 1].id : notes[0].id
            note.prevNoteId = notes[noteIdx - 1]
                ? notes[noteIdx - 1].id
                : notes[notes.length - 1].id
            return note
        })
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTES_KEY, note)
    } else {
        return storageService.post(NOTES_KEY, note)
    }
}

function getEmptyNote(id = '', type = '', info = {}) {
    return { id, type, info }
}

function getFilterBy() {
    return { ...gFilterBy }
}

function setFilterBy(filterBy = {}) {
    if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt
    if (filterBy.date !== undefined) gFilterBy.date = filterBy.date
    return gFilterBy
}

function getNextNoteId(noteId) {
    return storageService.query(NOTES_KEY).then(notes => {
        var idx = notes.findIndex(note => note.id === noteId)
        if (idx === notes.length - 1) idx = -1
        return notes[idx + 1].id
    })
}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTES_KEY)
    if (!notes || !notes.length) {
        const notes = [
            {
                id: 'n100',
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    txt: 'Fullstack Me Baby!'
                }
            },
            {
                "id": "n101",
                "createdAt": 1630307463000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Remember to call John",
                    "backgroundColor": "#ffd166"
                }
            },
            {
                "id": "n102",
                "createdAt": 1630307464000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                    "txt": "Buy milk and eggs",
                    "backgroundColor": "#06d6a0"
                }
            },
            {
                "id": "n103",
                "createdAt": 1112222,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                    "txt": "לקנות קילו עגבניות",
                    "backgroundColor": "#c54444"
                }
            },
            {
                "id": "n104",
                "createdAt": 1630307466000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Finish the report",
                    "backgroundColor": "#118ab2"
                }
            },
            {
                "id": "n105",
                "createdAt": 1630307467000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                    "txt": "Book flight tickets",
                    "backgroundColor": "#ffd166"
                }
            },
            {
                "id": "n106",
                "createdAt": 1630307468000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Pick up dry cleaning",
                    "backgroundColor": "#06d6a0"
                }
            },
            {
                "id": "n107",
                "createdAt": 1630307469000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Send birthday gift",
                    "backgroundColor": "#ef476f"
                }
            },
            {
                "id": "n108",
                "createdAt": 1630307470000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Schedule dentist appointment",
                    "backgroundColor": "#ffd166"
                }
            },
            {
                "id": "n109",
                "createdAt": 1630307471000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Buy groceries",
                    "backgroundColor": "#118ab2"
                }
            },
            {
                "id": "n110",
                "createdAt": 1630307472000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                    "txt": "Call mom",
                    "backgroundColor": "#ef476f"
                }
            },
            {
                "id": "n111",
                "createdAt": 1630307473000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Make dinner reservation",
                    "backgroundColor": "#06d6a0"
                }
            },
            {
                "id": "n112",
                "createdAt": 1630307474000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Take the dog for a walk",
                    "backgroundColor": "#ffd166"
                }
            },
            {
                "id": "n113",
                "createdAt": 1630307475000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                    "txt": "Buy birthday present",
                    "backgroundColor": "#118ab2"
                }
            },
            {
                "id": "n114",
                "createdAt": 1630307476000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                    "txt": "Go to the gym",
                    "backgroundColor": "#c54444"
                }
            },
            {
                "id": "n115",
                "createdAt": 1630307477000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Call the plumber",
                    "backgroundColor": "#06d6a0"
                }
            },
            {
                "id": "n116",
                "createdAt": 1630307478000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Write a blog post",
                    "backgroundColor": "#ef476f"
                }
            },
            {
                "id": "n117",
                "createdAt": 1630307479000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                    "txt": "Buy new shoes",
                    "backgroundColor": "#ffd166"
                }
            },
            {
                "id": "n118",
                "createdAt": 1630307480000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Water the plants",
                    "backgroundColor": "#118ab2"
                }
            },
            {
                "id": "n119",
                "createdAt": 1630307481000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Finish the book",
                    "backgroundColor": "#06d6a0"
                }
            },
            {
                "id": "n120",
                "createdAt": 1630307482000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                    "txt": "Start a new project",
                    "backgroundColor": "#ef476f"
                }
            },
            {
                "id": "n121",
                "createdAt": 1630307483000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                  "txt": "Attend the meeting",
                  "backgroundColor": "#ffd166"
                }
              },
              {
                "id": "n122",
                "createdAt": 1630307484000,
                "type": "NoteTxt",
                "isPinned": false,
                "info": {
                  "txt": "Clean the house",
                  "backgroundColor": "#06d6a0"
                }
              },
              {
                "id": "n123",
                "createdAt": 1630307485000,
                "type": "NoteTxt",
                "isPinned": true,
                "info": {
                  "txt": "Take a break",
                  "backgroundColor": "#c54444"
                }
              }
        ]
        utilService.saveToStorage(NOTES_KEY, notes)
    }
}

function _createNote(txt = '') {
    const note = getEmptyNote()
    note.id = utilService.makeId()
    note.info = { txt }
    note.style.backgroundColor = '#00d'
    return note
}
