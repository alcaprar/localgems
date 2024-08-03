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
    setup() {
        definePageMeta({
            layout: "admin",
            middleware: "auth"
        });
    },
    data() {
        return {
            items: [{
                date: "2024-07-22",
                fixed: [
                    "Nella pagina di ingresso agli ordini, non fa più differenza se è maiuscolo o no lo username dei clienti."
                ]
            }, {
                date: "2024-07-21",
                added: [
                    "Possibilità di definire qualsiasi tipo di unità da usare con i prodotti."
                ]
            }, {
                date: "2024-07-19",
                added: [
                    "Aggiunto pulsante di conferma ordine nella pagina del cliente. Anche nella vista degli ordini è stata aggiunta una colonna che dice se l'ordine è stato confermato.",
                    "Non far inviare gli ordini quando la finestra di vendita è chiusa."
                ]
            }, {
                date: "2024-07-17",
                added: [
                    "Quando il cliente non ha ordinato un prodotto e la quantità disponibile è zero viene mostrato come terminato e barrato."
                ]
            }, {
                date: "2024-07-16",
                added: [
                    "Basta premere invio per salvare prezzo e quantità nella pagina della vendita.",
                    "Viene mostrata la conferma di modifica o un messaggio di errore in caso di errore quando si modifica prezzo e quantità nella pagina della vendita."
                ]
            }, {
                date: "2024-07-11",
                added: [
                    "Quando una vendita è creata con successo viene mostrato un avviso.",
                    "Quando si clicca/preme sulla riga di una vendita apre la pagina di dettaglio."
                ],
                fixed: [
                    "Il pulsante per aggiungere nuovi prodotti è stato spostato in alto vicino alla scritta 'Prodotti'.",
                    "Il pulsante per aggiungere nuove vendite è stato spostato in alto vicino alla scritta 'Finestre di vendita'."
                ]
            }, {
                date: "2024-07-10",
                added: ["Aggiunta pagina di login per gli utenti."]
            }, {
                date: "2024-07-06",
                added: ["Aggiunta una nuova pagina in cui verranno annunciate nuove funzionalità e risoluzioni di problemi. Non è visibile ai clienti."],
                fixed: ["Il menù non si chiudeva quando si sceglieva un opzione e bisognava premere la X manualmente."]
            }, {
                date: "2024-07-05",
                added: ["Rilascio prima versione alpha."]
            }]
        }
    },
}
</script>