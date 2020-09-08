<template>
    <Page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			
			<StackLayout  dock="center" class="root" >
				<Label class="sousTitre" :text="defiNom" textWrap="true"/>
				<GridLayout rows="auto,auto,auto" columns="*,*" > 
					<Label row="0" col="0" class="label" text="Participant" verticalAlignment="center"/>
					<ListPicker row="1" col="0" v-if="!$store.state.selectedScore" ref="profilEnCours" :items="$store.state.selectedEquipe.participants" textField="nom" />
					<Label row="1" col="0" v-else :text="participantNom" verticalAlignment="center" horizontalAlignment="center"/>
					<Label row="0" col="1" class="label" text="Score"  verticalAlignment="center"/>
					<ListPicker row="1" col="1" ref="scoreEnCours" :items="scoresRef" :selectedIndex="score.score" />
					<Button row="2" col="0" v-if="$store.state.selectedScore" class="boutonAction" text="Supprimer" @tap="supprimerScore" />
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
			participantNom() {
				return this.score.participant ? this.score.participant.nom : "Non défini";
			},
			defiNom() {
				return "Defi : "+this.$store.state.selectedDefi.defi.nom;
			},
			
        },
        data() {
            return {
				scoresRef: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
				score : {
					score : 10,
					participant : null,
					defi : this.$store.state.selectedDefi.defi,
				},
            }
        },
		mounted() {
			if(this.$store.state.selectedScore) {
					this.score =  this.$store.state.selectedScore;
			} 
			
        },
		methods: {
			saveScore() {
				// recuperation du score 
				let indexScore = this.$refs.scoreEnCours.nativeView;
				// récupération de l'ID du profil
				this.score.score = parseInt(this.scoresRef[indexScore.selectedIndex]);
				
				
				//recuperation du participant si necessaire
				if (!this.score.participant) {
					let indexProfil = this.$refs.profilEnCours.nativeView;
					this.score.participant = this.$store.state.selectedEquipe.participants[indexProfil.selectedIndex];
				}
				if (this.$store.state.selectedScore) {
					//console.log("ADDSCORE : SaveScore update  :");
					this.$store.dispatch("updateScore", {"score" : this.score});
				}
				else {
					//console.log("ADDSCORE : SaveScore insert :");
					this.$store.dispatch("insertScore", {"score" : this.score});
				}
				this.$store.state.selectedScore = null;
				this.$navigateTo(affichageDefi);
            },
			supprimerScore() {
				this.$store.dispatch("deleteScore", {"score" : this.$store.state.selectedScore});
				alert({
				  title: "Suppression du score",
				  message: "Le score a été supprimé",
				  okButtonText: "OK"
				}).then(() => {
				  //console.log("Alert dialog closed");
				  this.$navigateTo(affichageDefi);
				});
				
			}
			
		},
    };
</script>

<style>

</style>