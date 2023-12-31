import { noteService } from "../../../services/note.service.js";
import { mailService } from "../../../services/mail.service.js";
import { eventBus, showSuccessMsg } from "../../../services/event-bus.service.js";

export default {
    template: `
    <div class="note-details-container" @click="closeModal">
        <section class="note-details" v-if="note" :style="{ backgroundColor: note.info.backgroundColor || 'bisque' }">
            <textarea class="note-title" v-model="note.info.title" :style="{ backgroundColor: note.info.backgroundColor || 'bisque' }">{{ note.info.title }}</textarea>
            <img v-if="note.info.imgUrl" :src="note.info.imgUrl" class="note-img" />
            <iframe v-if="note.info.videoUrl" :src="note.info.videoUrl" class="note-video"></iframe>
            <textarea class="note-txt" v-model="note.info.txt" :style="{ backgroundColor: note.info.backgroundColor || 'bisque' }">{{ note.info.txt }}</textarea>
            <h4 class="note-date" >Created at: {{ date }}</h4>
            <button class="save-btn" @click="saveNote">Save</button>
            <button class="send-mail-btn material-icons-outlined" @click="sendNoteAsMail">mail_outline</button>
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

            noteService.get(noteId).then(note => {
                this.note = note
                this.getFormattedDate()
            })
        },
        getFormattedDate() {
            const date = new Date(this.note.createdAt)
            this.date = date.toDateString()
        },
        closeModal(event) {
            if (event.target.classList.contains("note-details-container")) {
                this.$router.push('/keep')
            }
        },
        saveNote() {
            noteService.save(this.note)
                .then(() => {
                    window.location.href = "/#/keep"
                    showSuccessMsg('Note saved')
                    // window.location.reload()
                }).catch(err => {
                    console.error('Error saving note:', err)
                })
        },
        sendNoteAsMail() {
            const title = this.note.info.title
            const txt = this.note.info.txt
            mailService.createNoteDraft(title, txt)
                .then(noteDraft => {
                    const mailId = noteDraft.id
                    this.$router.push('/mail/' + mailId)
                    showSuccessMsg('Note added to drafts')
                })
        }
    },
    created() {
        this.loadNote()
    },
    components: {
        noteService
    }
}
