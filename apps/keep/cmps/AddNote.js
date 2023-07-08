import { noteService } from "../../../services/note.service.js"
import { showSuccessMsg } from '../../../services/event-bus.service.js'



export default {
    template: `
            <section class="keep-menu">
                <input v-model="note.info.txt" class="create-note-input" type="text" placeholder="What's on your mind?">
                <button @click="addNote()" class="add-note-btn material-icons-outlined">text_fields</button> 
                <button @click="addImage()" class="add-note-btn material-icons-outlined">image</button>
                <input type="file" ref="imageUpload" @change="uploadImage" style="display:none">
                <button @click="addVideo()" class="add-note-btn material-icons-outlined">video_library</button>
                <button @click="addList()" class="add-note-btn material-icons-outlined">format_list_numbered</button>
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
                    showSuccessMsg('Note added')
                    this.note = noteService.getEmptyNote()
                })
                .catch(err => {
                    console.error('Error saving note:', err)
                })
        },
        addImage() {
            this.$refs.imageUpload.click()
        },
        uploadImage(e) {
            const file = e.target.files[0]
            const reader = new FileReader()

            reader.onloadend = () => {
                this.note.info.imgUrl = reader.result
                this.note.type = 'noteImg'
                this.addNote()
                showSuccessMsg('Image added')
            }

            if (file) {
                reader.readAsDataURL(file)
                this.note = noteService.getEmptyNote()

            }
        },
        addVideo() { 
            this.note.type = 'noteVideo'
            this.note.info.videoUrl = prompt('Enter video URL')
            this.addNote()
            this.note = noteService.getEmptyNote()
            showSuccessMsg('Video added')
        },
        addList() {
            showSuccessMsg('Imagine that you added a list! meragesh 😐')
        }
    },
    components: {
        noteService
    }
}