<template>
    <Page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			
			<StackLayout  dock="center" class="root" >
				<Label class="sousTitre" :text="defiNom" textWrap="true"/>
				<GridLayout rows="auto,auto,auto" columns="*,*" > 
					<Label row="0" col="0" class="label" text="Participant" verticalAlignment="center"/>
					<ListPicker row="1" col="0" v-if="isNouveauScore" ref="profilEnCours" :items="$store.state.participants" textField="firstname" />
					<Label row="1" col="0" v-else :text="participant" verticalAlignment="center" horizontalAlignment="center"/>
					<Label row="0" col="1" text="Score"  verticalAlignment="center"/>
					<ListPicker row="1" col="1" ref="scoreEnCours" :items="scoresRef" :selectedIndex="selectedIndexScore" />
					<Button row="2" col="0" class="boutonAction" text="Annuler" @tap="annuler" />
					<Button row="2" col="1" class="boutonAction" text="Enregistrer" @tap="saveScore" />
				</GridLayout>
			</StackLayout>
		</DockLayout>
		
	</page>
	
	
</template>

<script>
	import affichageDefi from "../defi/affichageDefi";
	export default {
		computed: {
			selectedIndexScore() {
				if(this.$store.state.selectedScore) {
					return this.$store.state.selectedScore.score;
				}
				return 10;
			},
			participant() {
				if (this.$store.state.selectedScore) {
					let profilEnCours = this.$store.state.participants.find(e => e.id == this.$store.state.selectedScore.idProfil);
					return profilEnCours.firstname+ " "+profilEnCours.lastname;

				}
				return ""
			},
			isNouveauScore() {
				return this.$store.state.selectedScore == null;
			},
			defiNom() {
				return "Defi : "+this.$store.state.selectedDefi.nom;
			},
			
        },
        data() {
            return {
				scoresRef: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
            }
        },
		mounted() {
        },
		methods: {
			saveScore() {
				// récupération de l'ID du profil
				let idProfil = -1;
				if (this.$store.state.selectedScore) {
					console.log("SaveScore update :");
					idProfil = this.$store.state.selectedScore.idProfil;
				}
				else {
					let indexProfil = this.$refs.profilEnCours.nativeView;
					idProfil = this.$store.state.participants[indexProfil.selectedIndex].id;
					console.log("Récupération de l'index : "+indexProfil+" : ayant pour id : "+idProfil);
				}
				let indexScore = this.$refs.scoreEnCours.nativeView;
				// récupération de l'ID du profil
				let score = this.scoresRef[indexScore.selectedIndex];
				console.log("Récupération de l'index : "+indexScore+" : ayant pour valeur : "+score);
				if (this.$store.state.selectedScore) {
					console.log("sauvegarde des valeurs 1 : "+this.$store.state.selectedScore.id+"-"+this.$store.state.selectedDefi.id+"-"+idProfil+"-"+score);
					this.$store.dispatch("insertScore", {id : this.$store.state.selectedScore.id ,idDefi : this.$store.state.selectedDefi.id,idProfil : idProfil, score : score});
				}
				else {
					console.log("sauvegarde des valeurs 2 : "+this.$store.state.selectedDefi.id+"-"+idProfil+"-"+score);
					this.$store.dispatch("insertScore", {idDefi : this.$store.state.selectedDefi.id,idProfil : idProfil, score : score});
				}
				this.$store.state.selectedScore = null;
				this.$navigateTo(affichageDefi);
            },
			annuler() {
				this.$store.state.selectedScore = null;
				this.$navigateTo(affichageDefi);
			}
			
		},
    };
</script>

<style>

</style>