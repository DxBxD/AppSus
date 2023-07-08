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
                })
                .catch(err => {
                    console.error('Error saving note:', err)
                })
        },
        addImage() {
            this.$refs.imageUpload.click() 
        },
        addVideo() {
            console.log('Adding video')
        },
        addList() {
            console.log('Adding list')
        }
    },
    components: {
        noteService
    }
}