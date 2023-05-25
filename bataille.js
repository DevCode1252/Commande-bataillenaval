const { MessageEmbed, MessageButton } = require('discord.js');

module.exports = {
    data: {
        name: 'bataillenavale',
        description: 'Joue à la bataille navale avec le bot',
    },
    async execute(interaction) {
        const { member, channel } = interaction;

        // Initialisation du jeu de la bataille navale

        // Placement aléatoire du bateau sur un plateau de jeu de 5x5
        const row = Math.floor(Math.random() * 5);
        const col = Math.floor(Math.random() * 5);

        // Création de l'embed pour afficher le plateau de jeu initial
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Bataille Navale')
            .setDescription('Plateau de jeu :')
            .addField('A   B   C   D   E', '-----------------')
            .addField('1', '-   -   -   -   -')
            .addField('2', '-   -   -   -   -')
            .addField('3', '-   -   -   -   -')
            .addField('4', '-   -   -   -   -')
            .addField('5', '-   -   -   -   -');

        // Envoi de l'embed pour afficher le plateau de jeu initial
        const gameMessage = await channel.send({ embeds: [embed] });

        let gameOver = false;

        while (!gameOver) {
            // Attente de la réponse du joueur
            await channel.send('Entrez les coordonnées pour attaquer, par exemple `A1`, `B2`, etc.');

            const filter = m => m.author.id === member.id;
            const userResponse = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const userMessage = userResponse.first();

            // Suppression du message du joueur
            userMessage.delete();

            // Vérification de la réponse du joueur
            const coordinates = userMessage.content.toUpperCase();
            const colIndex = coordinates.charCodeAt(0) - 65;
            const rowIndex = parseInt(coordinates.slice(1)) - 1;

            // Vérification de la validité des coordonnées
            if (isNaN(rowIndex) || isNaN(colIndex) || rowIndex < 0 || rowIndex >= 5 || colIndex < 0 || colIndex >= 5) {
                channel.send('Veuillez entrer des coordonnées valides.');
                continue;
            }

            // Mise à jour de l'embed avec le résultat du tour
            const result = rowIndex === row && colIndex === col ? 'Félicitations, vous avez coulé le bateau !' : 'Désolé, vous avez manqué la cible.';
            embed.fields[rowIndex + 1].value = embed.fields[rowIndex + 1].value.replace('-', result);

            // Mise à jour de l'embed dans le message existant
            await gameMessage.edit({ embeds: [embed] });

            // Vérification si le joueur a gagné
            if (rowIndex === row && colIndex === col) {
                gameOver = true;
                await channel.send('Félicitations, vous avez gagné la partie !');
            }
        }
    },
};
