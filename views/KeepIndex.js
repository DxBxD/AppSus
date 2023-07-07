import AddNote from '../apps/keep/cmps/AddNote.js'
import { noteService } from "../services/note.service.js"
import NoteList from "../apps/keep/cmps/NoteList.js"

// TODO - GET HELP ON LAYOUT
// TODO - replace with a modal, with a backdrop.
// TODO - Add Pin feature, render by pin.


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
    components: {
        NoteList,
        AddNote
    }
}
