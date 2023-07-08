import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { eventBus } from './event-bus.service.js'

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
    updateIsPinned,
    saveMailAsNote,
}
window.noteService = noteService

function query() {
    return storageService.query(NOTES_KEY)
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
        .then(note => _setNextPrevNoteId(note))
}

function _setNextPrevNoteId(note) {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            const noteIdx = notes.findIndex(currNote => currNote.id === note.id)
            note.nextNoteId = notes[noteIdx + 1] ? notes[noteIdx + 1].id : notes[0].id
            note.prevNoteId = notes[noteIdx - 1]
                ? notes[noteIdx - 1].id
                : notes[notes.length - 1].id
            return note
        })
}

function save(note) {
    console.log('note:', note)
    if (note.id) {
        return storageService.put(NOTES_KEY, note)
            .then(() => {
                eventBus.emit('update-notes')
                return query()
            })
    } else {
        return storageService.post(NOTES_KEY, note)
            .then(() => {
                eventBus.emit('update-notes')
                return query()
            })
    }
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
        .then(() => {
            eventBus.emit('update-notes')
            return query()
        })
}

function getEmptyNote(id = '', type = '', info = {}, style = {}) {
    return { id, type, info, style }
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
                id: utilService.makeId(),
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: 'Fullstack Me Baby!',
                    backgroundColor: "#ef476f"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307463000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Remember to call John",
                    backgroundColor: "#ffd166"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307464000,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Buy milk and eggs",
                    backgroundColor: "#06d6a0"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "לקנות קילו עגבניות",
                    backgroundColor: "#c54444"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307466000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Finish the report",
                    backgroundColor: "#118ab2"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307467000,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Book flight tickets",
                    backgroundColor: "#ffd166"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307468000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Pick up dry cleaning",
                    backgroundColor: "#06d6a0"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307469000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Send birthday gift",
                    backgroundColor: "#ef476f"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307470000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Schedule dentist appointment",
                    backgroundColor: "#ffd166"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307471000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Buy groceries",
                    backgroundColor: "#118ab2"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307472000,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Call mom",
                    backgroundColor: "#ef476f"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307473000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Make dinner reservation",
                    backgroundColor: "#06d6a0"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307474000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Take the dog for a walk",
                    backgroundColor: "#ffd166"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307475000,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Buy birthday present",
                    backgroundColor: "#118ab2"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307476000,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Go to the gym",
                    backgroundColor: "#c54444"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307477000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Call the plumber",
                    backgroundColor: "#06d6a0"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307478000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Write a blog post",
                    backgroundColor: "#ef476f"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307479000,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Buy new shoes",
                    backgroundColor: "#ffd166"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307480000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Water the plants",
                    backgroundColor: "#118ab2"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307481000,
                type: "NoteTxt",
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Finish the book",
                    backgroundColor: "#06d6a0"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307482000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Start a new project",
                    backgroundColor: "#ef476f"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307483000,
                type: "NoteTxt",
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Attend the meeting",
                    backgroundColor: "#ffd166"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307484000,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: "Clean the house",
                    backgroundColor: "#06d6a0"
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1630307485000,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: "Take a break",
                    backgroundColor: "#c54444"
                }
            }
        ]
        utilService.saveToStorage(NOTES_KEY, notes)
    }
}

function _createNote(title = '', txt = '', backgroundColor = '#00d') {
    const note = getEmptyNote()
    note.id = utilService.makeId()
    note.info = { txt, title }
    note.backgroundColor = { backgroundColor: backgroundColor }
    return save(note)
}

function updateIsPinned(noteId, isPinned) {
    return get(noteId)
        .then(note => {
            // create a copy of the note with the new isPinned value
            const updatedNote = { ...note, isPinned: isPinned }

            // replace the note in the array with the updated note
            return save(updatedNote)
        })
}

function saveMailAsNote(subject = '', txt = '') {
    const note = getEmptyNote()
    note.id = utilService.makeId()
    note.info = { txt, title: subject }
    note.backgroundColor = { backgroundColor: '#eddb72' }
    save(note)
}