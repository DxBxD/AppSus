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
    updateIsPinned
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
                id: utilService.makeId(),
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: false,
                info: {
                    title: 'Sample Title',
                    txt: 'Fullstack Me Baby!'
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: 'Fullstack Me Baby!Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                }
            },
            {
                id: utilService.makeId(),
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                info: {
                    title: 'Sample Title',
                    txt: 'Do NOT! Fullstack Me Baby!'
                }
            },

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

function updateIsPinned(noteId, isPinned) {
    return get(noteId)
        .then(note => {
            // create a copy of the note with the new isPinned value
            const updatedNote = { ...note, isPinned: isPinned }

            // replace the note in the array with the updated note
            return save(updatedNote)
        })
}