import { noteService } from "../../../services/note.service.js"


export default {
    props: ['note'],
    template: `
    <!-- <section class="note-preview"> -->
        <article class="note" :style="{ backgroundColor: note.info.backgroundColor || 'defaultColor' }"> 
            <p> {{ note.info.txt }} </p> 
            <section class="note-btns">
                <button class="remove-note-btn" @click="removeNote"><span class="material-icons-outlined">delete</span></button>
                <button class="edit-note-btn"><span class="material-icons-outlined">edit</span></button>
                <button class="color-palette-btn"><span class="material-icons-outlined color-input-container">palette<input type="color" class="color-palette-input" @input="changeColor($event)"></span></button>
                <button class="pin-note-btn"><span class="material-icons-outlined">push_pin</span></button>
            </section>
        </article>
    <!-- </section> -->
    `,
    methods: {
        removeNote() {
            noteService.remove(this.note.id)
                .then(() => {
                    this.$emit('removeNote')
                })
        },
        changeColor(event) {
            const selectedColor = event.target.value
            this.note.info.backgroundColor = selectedColor
            noteService.save(this.note)            
        }

    },

}
