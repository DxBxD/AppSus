import AddNote from '../apps/keep/cmps/AddNote.js'
import { noteService } from "../services/note.service.js"
import NoteList from "../apps/keep/cmps/NoteList.js"

// TODO - GET HELP ON LAYOUT
// TODO - how to see text change without reloading?.
// TODO - Add Pin feature, render by pin.
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
                v-if="notes"
                :notes="notes" 
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
        this.fetchNotes()
    },
    methods: {
        fetchNotes() {
            noteService.query()
                .then(notes => this.notes = notes)
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
        notes: {
            deep: true,
            handler() {
                this.fetchNotes()
            }
        },
        '$route.params.id': {
            immediate: true,
            handler() {
                this.fetchNotes()
            }
        }
    }
    ,
    components: {
        NoteList,
        AddNote
    }
}
