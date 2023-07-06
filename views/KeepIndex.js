import AddNote from '../apps/keep/cmps/AddNote.js'
import { noteService } from "../services/note.service.js"
import NoteList from "../apps/keep/cmps/NoteList.js"

export default {
    template: `
        <section class="keep-options-bar">
            <AddNote @noteAdded="addNote"/>
        </section>
        <section class="keep-index">
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
            console.log('id:', id)
            // this.$router.push(`keep/n101`)

        }
    },
    components: {
        NoteList,
        AddNote
    }
}
