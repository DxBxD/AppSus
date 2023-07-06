import { noteService } from "../../../services/note.service.js"


export default {
    template: `
            <section class="keep-menu">
                <input v-model="note.info.txt" class="create-note-input" type="text" placeholder="What's on your mind?">
                <button @click="addNote()" class="add-note-btn material-icons">add</button> 
            </section>
            `,
    data() {
        return {
            note: noteService.getEmptyNote(),
        }
    },
    methods: {
        addNote() {
            noteService.save(this.note)
                .then(savedNote => {
                    console.log('Saved Note:', savedNote)
                    this.$emit('noteAdded')
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