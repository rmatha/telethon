<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="Home"></Label>
        </ActionBar>
		<GridLayout>
			<StackLayout>
				<Label class="info" horizontalAlignment="center" verticalAlignment="center">
					<FormattedString>
						<Span class="fa" text.decode="&#xf135; "/>
						<Span :text="messageAffichage"/>
					</FormattedString>
				</Label>
				<li
				<button text="charger mon tableau" @tap="charger" />
				<button text="groupir mon tableau" @tap="groupir" />
				<ListView for="moyenne in moyenneDefi">
					<v-template>
						<Label :text="affichageMoyenneDefi(moyenne)" />
					</v-template>
				</ListView>
				<ListView for="moyenne in moyenneProfil">
					<v-template>
						<Label :text="affichageMoyenneProfil(moyenne)" />
					</v-template>
				</ListView>
			</StackLayout>
		</GridLayout>
    </Page>
</template>

<script>
    export default {
		data() {
            return {
				scoreEquipe : [],
				message : "Lancement de l'application",
				moyenneDefi : [],
				moyenneProfil : [],
            };
        },
        computed: {
            messageAffichage() {
                return this.message;
            },
			
        },
		methods: {
			affichageMoyenneDefi(moyenne) {
				return "le Défi "+moyenne.idDefi+" a une moyenne de "+moyenne.moyenne;
			},
			affichageMoyenneProfil(moyenne) {
				return "le Participant "+moyenne.idProfil+" a une moyenne de "+moyenne.moyenne;
			},
			charger() {
				console.log("Lancement du chargement du tableau");
				console.log(this.$_.random(20));
				this.scoreEquipe = [];
				this.scoreEquipe.push({id : 0,idDefi : 0,idProfil : 0 ,score : 7});
				this.scoreEquipe.push({id : 1,idDefi : 1,idProfil : 1 ,score : 20});
				this.scoreEquipe.push({id : 2,idDefi : 3,idProfil : 0 ,score : 9});
				this.scoreEquipe.push({id : 3,idDefi : 2,idProfil : 1 ,score : 15});
				this.scoreEquipe.push({id : 4,idDefi : 2,idProfil : 0 ,score : 10});
				this.scoreEquipe.push({id : 5,idDefi : 1,idProfil : 1 ,score : 11});
				this.scoreEquipe.push({id : 6,idDefi : 0,idProfil : 0 ,score : 18});
				this.message = "Taille de mon tableau : "+this.scoreEquipe.length;
			},
			groupir() {
				this.message = "";
				// on gére pour les moyennes par défis
				var scoreByDefi = _.groupBy(this.scoreEquipe,"idDefi");
				console.log(JSON.stringify(scoreByDefi));
				console.log("--------------------------");
				_.forEach(scoreByDefi, function(scoreTemp,idDefi) {
					console.log("idDefi : "+idDefi+" enregistrements : "+JSON.stringify(scoreTemp));
					var scores = _.map(scoreTemp,"score");
					console.log("scores : "+JSON.stringify(scores));
					var moyenne = _.meanBy(scoreTemp, 'score');
					console.log("moyenne : "+moyenne);
					this.moyenneDefi.push({ idDefi:idDefi, moyenne : moyenne});
				}.bind(this));
				// on gére pour les moyennes par participant
				var scoreByProfil = _.groupBy(this.scoreEquipe,"idProfil");
				console.log(JSON.stringify(scoreByProfil));
				console.log("--------------------------");
				_.forEach(scoreByProfil, function(scoreTemp,idProfil) {
					console.log("idProfil : "+idProfil+" enregistrements : "+JSON.stringify(scoreTemp));
					var scores = _.map(scoreTemp,"score");
					console.log("scores : "+JSON.stringify(scores));
					var moyenne = _.meanBy(scoreTemp, 'score');
					console.log("moyenne : "+moyenne);
					this.moyenneProfil.push({ idProfil:idProfil, moyenne : moyenne});
				}.bind(this));
			},
		}
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .fa {
        color: $accent-dark;
    }

    .info {
        font-size: 20;
    }
</style>
