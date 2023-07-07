import { noteService } from "../../../services/note.service.js"

export default {
    props: ['note'],
    template: `
        <article :class="['note', { 'pinned-note': note.isPinned }]" :style="{ backgroundColor: note.info.backgroundColor || 'defaultColor' }"> 
        <span v-if="note.isPinned" class="pinned-note-icon" class="material-icons">push_pin</span>
            <h4> {{ note.info.title }} </h4>
            <p> {{ note.info.txt }} </p> 
            <section class="note-btns">
                <button class="remove-note-btn" @click="removeNote" @click.stop><span class="material-icons">delete</span></button>
                <input type="color" class="color-palette-input" @click.stop @input="changeColor($event)"></button>
                <button class="pin-note-btn" @click.stop="togglePin"><span class="material-icons">{{ isPinned ? 'push_pin' : 'outlined_flag' }}</span></button>
            </section>
        </article>
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
        },
        togglePin() {
            this.note.isPinned = !this.note.isPinned
            noteService.updateIsPinned(this.note.id, this.note.isPinned)
        }
    },
    computed: {
        isPinned() {
            return this.note.isPinned
        }
    }
}
