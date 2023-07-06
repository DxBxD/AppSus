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
                id: 'n101',
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                style: {
                    backgroundColor: '#00d',
                },
                info: {
                    txt: 'Fullstack Me Baby!'
                }
            },
            {
                id: 'n102',
                type: 'NoteImg',
                isPinned: false,
                info: {
                    url: 'http://some-img/me',
                    title: 'Bobi and Me'
                },
                style: {
                    backgroundColor: '#00d',
                },
            },
            {
                id: 'n103',
                type: 'NoteTodos',
                isPinned: false,
                info: {
                    title: 'Get my stuff together',
                    todos: [
                        { txt: 'Driving liscence', doneAt: null },
                        { txt: 'Coding power', doneAt: 187111111 }
                    ]
                },
            },
        ]
        utilService.saveToStorage(NOTES_KEY, notes)
    }
}

function _createNote(txt = '') {
    const note = getEmptyNote()
    note.id = utilService.makeId()
    note.info = { txt }
    return note
}
