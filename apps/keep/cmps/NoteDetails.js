import { noteService } from "../../../services/note.service.js";

export default {
    template: `
    <div class="note-details-container" @click="closeModal">
        <section class="note-details" v-if="note" :style="{ backgroundColor: note.info.backgroundColor || 'bisque' }">
            <textarea class="note-title" v-model="note.info.title" :style="{ backgroundColor: note.info.backgroundColor || 'bisque' }">{{ note.info.title }}</textarea>
            <textarea class="note-txt" v-model="note.info.txt" :style="{ backgroundColor: note.info.backgroundColor || 'bisque' }">{{ note.info.txt }}</textarea>
            <h4 class="note-date" >Created at: {{ date }}</h4>
            <button class="save-btn" @click="saveNote">Save</button>
        </section>
    </div>
    `,
    data() {
        return {
            note: null,
            date: null
        }
    },
    methods: {
        loadNote() {
            const urlParts = window.location.href.split('/')
            const noteId = urlParts[urlParts.length - 1]
            console.log('noteId:', noteId)

            noteService.get(noteId).then(note => {
                this.note = note
                console.log('note:', note)
                this.getFormattedDate()
            })
        },
        getFormattedDate() {
            const date = new Date(this.note.createdAt)
            this.date = date.toDateString()
        },
        closeModal(event) {
            if (event.target.classList.contains("note-details-container")) {
                window.location.href = "/#/keep"
            }
        },
        saveNote() {
            console.log('this.note:', this.note)
            noteService.save(this.note)
                .then(() => {
                    window.location.href = "/#/keep"
                    window.location.reload()
                }).catch(err => {
                    console.error('Error saving note:', err)
                }
                )
        }
    },
    created() {
        this.loadNote()
    },
    components: {
        noteService
    }
}
