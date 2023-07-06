import { noteService } from "../../../services/note.service.js"


export default {
    template: `
            <section class="keep-menu">
                <input v-model="note" class="create-note-input" type="text" placeholder="What's on your mind?">
                <button @click="addNote()" class="add-note-btn">Add note</button> 
            </section>
            `,
    data() {
        return {
            newNote: noteService.getEmptyNote(),
        }
    },
    methods: {
        addNote() {
            console.log('Note added:', this.note)
            const note = noteService.getEmptyNote()
            note.info = {
                txt: this.note
            }
            noteService.save(note)
                .then(savedNote => {
                    console.log('Saved Note:', savedNote)
                })
                .catch(err => {
                    console.error('Error saving note:', err)
                })
        },
    },
    components: {
        noteService
    }
}