import AddNote from '../apps/keep/cmps/AddNote.js'
import { noteService } from "../services/note.service.js"
import NoteList from "../apps/keep/cmps/NoteList.js"
import { eventBus } from "../services/event-bus.service.js"


// TODO - GET HELP ON LAYOUT
// TODO - how to see text change without reloading?.
// TODO - add buttons to modal
// TODO - add filters
// TODO - add duplicate
// TODO - add support for images/videos/lists
// TODO - add title text to creating note
// TODO - work on ui 
// TODO - work on responsive design
// TODO - work on mobile design
// TODO - organize code


export default {
    template: `
        <section class="keep-options-bar">
            <AddNote @noteAdded="addNote"/>
        </section>
        <NoteList 
            v-if="sortedNotes.length"
            :notes="sortedNotes" 
            @removeNote="removeNote()"
            @openNote="openNote"/>
        </section>
        <router-view/>
    `,
    data() {
        return {
            notes: [],
        }
    },
    created() {
        this.fetchNotes();

        // Listen for the 'update-notes' event and update notes when it's emitted
        this.updateNotesListener = eventBus.on('update-notes', this.fetchNotes);
    },
    destroyed() {
        // Make sure to remove the event listener when the component is destroyed
        this.updateNotesListener();
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
        }
    },
    components: {
        NoteList,
        AddNote
    }
}
