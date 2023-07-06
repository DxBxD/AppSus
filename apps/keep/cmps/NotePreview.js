import { noteService } from "../../../services/note.service.js"


export default {
    props: ['note'],
    template: `
        <section class="note-preview">
            <article class="note">
                <p> {{ note.info.txt }} </p>
                <button @click="removeNote">X</button>
            </article>
        </section>`,
    methods: {
        removeNote() {
            noteService.remove(this.note.id)
                .then(() => {
                    this.$emit('removeNote')
                })
        }
    },
            
}
