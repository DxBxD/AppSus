import { noteService } from "../services/note.service.js"
import { eventBus } from "../services/event-bus.service.js"
import AddNote from '../apps/keep/cmps/AddNote.js'
import NoteList from "../apps/keep/cmps/NoteList.js"
import NoteFilter from "../apps/keep/cmps/NoteFilter.js"


// TODO on colorpicker, value should be the note's color
// TODO - invest in more robust demo data
// TODO - add filters
// TODO - add support for lists
// TODO - work on ui 
// TODO - work on responsive design
// TODO - add buttons to modal
// TODO - work on mobile design
// TODO - organize code



export default {
    template: `
        <section class="keep-page">
            <section class="keep-options-bar">
                <NoteFilter @set-filter="setFilter" />
                <AddNote @noteAdded="addNote"/>
            </section>
            <section class="note-list-container">
            <NoteList
                v-if="sortedNotes.length"
                :notes="sortedNotes"
                @removeNote="removeNote"
                @openNote="openNote"/>
            </section>
            <router-view/>
        </section>
    `,
    data() {
        return {
            notes: [],
            filter: null,
        }
    },
    created() {
        this.fetchNotes()

        // Listen for the 'update-notes' event and update notes when it's emitted
        this.updateNotesListener = eventBus.on('update-notes', this.fetchNotes)
    },
    destroyed() {
        // Make sure to remove the event listener when the component is destroyed
        this.updateNotesListener()
    },
    methods: {
        fetchNotes() {
            noteService.query()
                .then(notes => {
                    this.notes = notes
                })
                .catch(err => {
                    console.error('Error fetching notes:', err)
                })
        },
        addNote() {
            this.fetchNotes()
        },
        removeNote() {
            this.fetchNotes()
        },
        openNote(id) {
            this.$router.push(`keep/${id}`)
        },
        setFilter(value) {
            this.filter = value
            if (value === 'image') {
                noteService.getImageNotes()
                    .then(notes => {
                        this.notes = notes
                    }
                    )
            } else if (value === 'video') {
                noteService.getVideoNotes()
                    .then(notes => {
                        this.notes = notes
                    }
                    )
            } else if (value === 'text') {
                noteService.getTextNotes()
                    .then(notes => {
                        this.notes = notes
                    }
                    )
            } else if (value === 'all') {
                noteService.query()
                    .then(notes => {
                        this.notes = notes
                    }
                    )
            }

        }

    },
    watch: {
        '$route.params.id': {
            immediate: true,
            handler() {
                this.fetchNotes()
            }
        }

    },
    computed: {
        sortedNotes() {
            return this.notes.sort((a, b) => b.isPinned - a.isPinned)
        },
    },
    components: {
        NoteList,
        AddNote,
        NoteFilter
    }
}