export default {
    template: `
            <section class="keep-menu">
                <input v-model="note" class="create-note-input" type="text">
                <button @click="addNote()" class="add-note-btn">Add note</button> 
            </section>
            `,
    data() {
        return {
            note: "What's on your mind...",
        }
    },
    methods: {
        addNote() {
            console.log('Note added: ', this.note)
            $emit('addNote', this.note)
        },
    }
}