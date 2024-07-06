<template>
    <h1>Lista Aggiornamenti</h1>
    <template v-for="item in items" :key="item.date">
        <h2>{{ item.date }}</h2>
        <template v-if="item.added?.length > 0">
            <b>Nuove funzionalità</b>
            <ul>
                <li v-for="added in item.added"> {{ added }}</li>
            </ul>
        </template>
        <template v-if="item.fixed?.length > 0">
            <b>Sistemato</b>
            <ul>
                <li v-for="fixed in item.fixed"> {{ fixed }}</li>
            </ul>
        </template>
    </template>
</template>

<script>

export default {
    data() {
        return {
            items: [{
                date: "2024-07-06",
                fixed: ["Il menù non si chiudeva quando si sceglieva un opzione e bisognava premere la X manualmente."]
            }, {
                date: "2024-07-05",
                added: ["Rilascio prima versione alpha."]
            }]
        }
    },
}
</script>