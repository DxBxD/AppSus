import { noteService } from "../../../services/note.service.js"


export default {
    props: ['note'],
    template: `
    <!-- <section class="note-preview"> -->
        <article class="note" :style="{ backgroundColor: note.info.backgroundColor || 'defaultColor' }"> 
            <h4> {{ note.info.title }} </h4>
            <p> {{ note.info.txt }} </p> 
            <section class="note-btns">
                <button class="remove-note-btn" @click="removeNote" @click.stop><span class="material-icons">delete</span></button>
                <input type="color" class="color-palette-input" @click.stop @input="changeColor($event)"></button>
                <button class="pin-note-btn"><span class="material-icons" @click.stop>push_pin</span></button>
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
