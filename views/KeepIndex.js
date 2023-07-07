import AddNote from '../apps/keep/cmps/AddNote.js'
import { noteService } from "../services/note.service.js"
import NoteList from "../apps/keep/cmps/NoteList.js"

// TODO - check all of the hotfixes from Tal, make sure everything is working, worked on the layout...
// TODO - deleted/modified some elements from noteList/Preview
// TODO - Delete edit button, replace with a modal, with a backdrop.

export default {
    template: `
        <section class="keep-page">
            <section class="keep-options-bar">
                <AddNote @noteAdded="addNote"/>
            </section>
            <section class="note-list-container">
                <NoteList v-if="notes" :notes="notes" @removeNote="removeNote()" @openNote="openNote"/>
            </section>
            <router-view/>
        </section>
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
