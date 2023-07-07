import { noteService } from "../../../services/note.service.js";

export default {
    template: `
    <div class="note-details-container" @click="closeModal">
        <section class="note-details" v-if="note">
            <h2 class="note-title">{{ note.info.title }}</h2>
            <p class="note-txt">{{ note.info.txt }}</p>
            <h4 class="note-date" >Created at: {{ date }}</h4>
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
        }
    },
    created() {
        this.loadNote()
    },
    components: {
        noteService
    }
}
