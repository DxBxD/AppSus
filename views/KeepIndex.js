import NoteList from "../apps/keep/cmps/NoteList.js"

export default {
    template: `
        <section class="keep-index">
            <h1>Keep Index</h1>
            <NoteList 
                v-if="notes"
                :notes="notes">
        </section>
    `
    ,
    data() {
        return {
            notes: [],
            filterBy: null,
        }
    },
    components: {
        notes,
    }
}