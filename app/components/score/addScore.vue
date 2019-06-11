<template>
    <page>
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3">
					<Label :text="defiNom" />
					<Label text="Sélection du participant :" />
					<ListPicker v-if="isNouveauScore" ref="profilEnCours" :items="$store.state.profilsEquipe" textField="lastname" />
					<Label :text="participant"/>
					<Label text="Score obtenu :"/>
					<ListPicker ref="scoreEnCours" :items="scoresRef" :selectedIndex="selectedIndexScore" />
					
					
				<Button text="Enregistrer" @tap="saveScore" />
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
		
	</page>
	
	
</template>

<script>
	import affichageDefi from "../defi/affichageDefi";
	export default {
		computed: {
			selectedIndexScore() {
				if(this.score) {
					return this.score.score;
				}
				return 10;
			},
			participant() {
				if (this.score) {
					let profilEnCours = this.$store.state.profilsEquipe.find(e => e.id == this.score.idProfil);
					return profilEnCours.firstname+ " "+profilEnCours.lastname;

				}
				return ""
			},
			isNouveauScore() {
				return this.score == null;
			},
			defiNom() {
				return "Defi : "+this.defi.nom;
			},
			
        },
        props: ['score','categorie','defi'],
		data() {
            return {
				scoresRef: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
				id : -1,
            }
        },
		mounted() {
			if (this.score) {
				this.id = this.score.id
			}
        },
		methods: {
			saveScore() {
				// récupération de l'ID du profil
				let idProfil = -1;
				if (this.score) {
					console.log("SaveScore update :");
					idProfil = this.score.idProfil;
				}
				else {
					let indexProfil = this.$refs.profilEnCours.nativeView;
					idProfil = this.$store.state.profilsEquipe[indexProfil.selectedIndex].id;
					console.log("Récupération de l'index : "+indexProfil+" : ayant pour id : "+idProfil);
				}
				let indexScore = this.$refs.scoreEnCours.nativeView;
				// récupération de l'ID du profil
				let score = this.scoresRef[indexScore.selectedIndex];
				console.log("Récupération de l'index : "+indexScore+" : ayant pour valeur : "+score);
				console.log("sauvegarde des valeurs : "+this.id+"-"+this.defi.id+"-"+idProfil+"-"+score);
				this.$store.dispatch("insertScore", {id : this.id ,idDefi : this.defi.id,idProfil : idProfil, score : score});
				this.$navigateTo(affichageDefi, { props: {defi: this.defi, categorie: this.categorie}});
            },
			
		},
    };
</script>

<style>
.catTitle {
	color : black;
	font-weight: bold;
	font-size: 30;
}
.catNBDefis {
	color : white;
	font-weight: bold;
	font-size: 15;
}

</style>