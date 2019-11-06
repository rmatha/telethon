<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<ScrollView row="1" col="0" >
					<StackLayout width="100%" height="100%">
						<GridLayout rows="auto" columns="*,50,50" >
							<Label row="0" col="0" :text="$store.state.selectedDefi ? $store.state.selectedDefi.defi.nom : 'Vide'" class="sousTitre"/>
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/delete.png" @tap="deleteDefi"/>
							<Image row="0" col="2" class="actionButton" src="~/assets/icons/modify.png" @tap="modifyDefi"/>
						</GridLayout>
						<Button class="boutonAction" v-if="detail" text="Cacher les détails du défi" @tap="changeDetailState"/>
						<Button class="boutonAction" v-else text="Afficher les détails du défi" @tap="changeDetailState"/>
						<StackLayout v-if="detail">
							<Label class="label" text="Description Courte :"  />
							<Label :text="$store.state.selectedDefi ? $store.state.selectedDefi.defi.description_courte : 'Non renseigné'" class="defiDesc"/>
							<Label class="label" text="Description Longue :"  />
							<Label :text="$store.state.selectedDefi ? $store.state.selectedDefi.defi.description_longue : 'Non renseigné'" class="defiDesc"/>
							<Label class="label" text="Règlement :"  />
							<Label :text="$store.state.selectedDefi ? $store.state.selectedDefi.defi.reglementation : 'Non renseigné'" class="defiDesc"/>
							<Label class="label" text="Barême :"  />
							<Label :text="$store.state.selectedDefi ? $store.state.selectedDefi.defi.bareme : 'Non renseigné'" class="defiDesc"/>
						</StackLayout>
						<GridLayout v-if="$store.state.selectedEquipe" rows="auto" columns="*,50" >
							<Label row="0" col="0" class="label m-b-20" text="Liste des scores :" textWrap="true" />
							<Image row="0" col="1" v-if="defiPresent" src="~/assets/icons/add-256.gif" @tap="addScore"/>
						</GridLayout>
						<ListView  v-if="$store.state.selectedEquipe" for="score in scoresCurrentDefi">
						  <v-template>
							<GridLayout rows="auto" columns="*,50" width="100%" margin="0" @tap="editScore(score)">
								<GridLayout col="0" verticalAlignment="bottom">
									<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
										<Label :text="score.participant.nom" class="defiTitle" />
										
									</StackLayout>
								</GridLayout>
								<Label col="1" :text="score.score" class="defiTitle" />
							</GridLayout>
									
						  </v-template>
						</ListView>
						<Button class="boutonAction" v-if="defiPresent" :text="enleverDefiLabel" @tap="enleverDefi"/>
						<Button class="boutonAction" v-else :text="ajouterDefiLabel" @tap="ajouterDefi"/>	
					</StackLayout>
				</ScrollView>
			</StackLayout>
		</DockLayout>
		
	</page>
	
	
</template>

<script>
	
	import modal from "../include/modal";
	import listDefisCat from "./listDefisCat";
	import addScore from "../score/addScore";
	import store from "../store/teleStore";
	import affichageDefi from "./affichageDefi";
	import editDefi from "./editDefi";
	
	export default {
		computed: {
			ajouterDefiLabel() {
				if(this.$store.state.selectedCommune) {
					return "Ajouter a ma commune";
				}
				return "Ajouter à mes défis"
			},
			enleverDefiLabel() {
				if(this.$store.state.selectedCommune) {
					return "Enlever de ma commune";
				}
				return "Enlever de mes défis"
			},
			defiPresent() {			
				
				console.log("on vérifie si le défi est présent");
				console.log("this.$store.state.selectedCommune :"+this.$store.state.selectedCommune);
				console.log("this.$store.state.selectedCategorie :"+JSON.stringify(this.$store.state.selectedCategorie ));
				var filterDefi = []
				if (this.$store.state.selectedCommune) {
					
					filterDefi = this.$store.state.defiCommune.defis.filter(defi => {
						console.log("AFFICHAGEDEFI : DefiPrensent : defis : "+JSON.stringify(defi));
						return defi == this.$store.state.selectedDefi;
					});
					console.log("AFFICHAGEDEFI : DefiPrensent : terminée");
				}
				else {
					if (this.$store.state.selectedEquipe.defis_equipes) {
						console.log("on passe par defisEquipe");
						filterDefi = this.$store.state.selectedEquipe.defis_equipes.filter(defi => {
							console.log("AFFICHAGEDEFI : DefiPrensent : elem : "+JSON.stringify(defi));
							console.log("AFFICHAGEDEFI : DefiPrensent : selectedDEfi : "+JSON.stringify(this.$store.state.selectedDefi));
							return (defi == this.$store.state.selectedDefi) & !defi.delete;
						});
					}
				}
				if (filterDefi.length > 0) {
					console.log("le défi a été trouvé");
					return true;
				}
				console.log("le défi n'a pas été trouvé");
				return false;
				
			},
			
		},
        data() {
            return {
				scoresCurrentDefi : [],
				detail : false,
			}
        },
		mounted() {
			// chargement des scores pour le defi en cours
			console.log("AFFICHAGEDEFI : MOUNTED : selectedEquipe.scores : "+JSON.stringify(this.$store.state.selectedEquipe.scores));
			console.log("AFFICHAGEDEFI : MOUNTED : selectedDefi : "+JSON.stringify(this.$store.state.selectedDefi));
			if (this.$store.state.selectedEquipe.scores) {
				this.scoresCurrentDefi = this.$store.state.selectedEquipe.scores.filter(scoreItem => {
					console.log("AFFICHAGEDEFI : MOUNTED : "+JSON.stringify(scoreItem.defi.id)+" : "+JSON.stringify(this.$store.state.selectedDefi.defi.id));
					return (scoreItem.defi.id == this.$store.state.selectedDefi.defi.id) & !scoreItem.delete;
				});
				console.log("AFFICHAGEDEFI : MOUNTED : Liste des scores pour le DEFI  : "+JSON.stringify(this.scoresCurrentDefi));
			};
        },
		methods: {
			changeDetailState() {
				this.detail = !this.detail;
			},
			getProfilNom(item) {
				let profilEnCours = this.$store.state.participants.find(e => e.nom == item.participantNom);
				return profilEnCours.nom;
			},
			editScore(item) {
				console.log("Edit d'un  score :");
				this.$store.state.selectedScore = item;
				this.$navigateTo(addScore);
			},
			addScore() {
				console.log("Ajout d'un score");
				this.$store.state.selectedScore = null;
				this.$navigateTo(addScore);
			},
			deleteDefi(defi) {
				// affichage du modal de confirmation
				confirm({
				  title: "Suppression du défi",
				  message: "Confirmez-vous la suppression du défi de l'application ?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
				  console.log(result);
				  if (result) {
						console.log("on supprime ! ");
						this.$store.dispatch("deleteDefi", {"defi" : this.$store.state.selectedDefi});
						this.$store.state.selectedDefi = null;
						alert({
						  title: "Suppression du défi",
						  message: "Le défis a été supprimé de l'application",
						  okButtonText: "OK"
						}).then(() => {
						  console.log("Alert dialog closed");
						  this.$navigateTo(listDefisCat);
						});
					
						
						
					}
					else {
						console.log("pas touche !");
					}
				});
			},
			enleverDefi() {
				if (this.$store.state.selectedCommune) {
					console.log("on enleve de la liste de defisCommune");
					this.$store.dispatch("deleteDefisCurrentCommune", {"defi" : this.$store.state.selectedDefi});
				}
				else {
					console.log("on enleve de la liste de defisEquipe");
					this.$store.dispatch("deleteDefisEquipe", {"defi" : this.$store.state.selectedDefi});
				}
				alert({
					  title: "Ajout du défi",
					  message: "Le défis a été supprimé de la liste",
					  okButtonText: "OK"
					}).then(() => {
					  console.log("Alert dialog closed");
					  this.$navigateTo(affichageDefi);
					});
			},
			ajouterDefi() {
				if (this.$store.state.selectedCommune) {
					console.log("on ajoute de la liste de defisCommune");
					this.$store.dispatch("insertDefisCurrentCommune", {defi : this.$store.state.selectedDefi});
				}
				else {
					console.log("on ajoute de la liste de defisEquipe");
					this.$store.dispatch("insertDefisEquipe", {defi : this.$store.state.selectedDefi});
				}
				alert({
					  title: "Ajout du défi",
					  message: "Le défis a été ajouté à la liste",
					  okButtonText: "OK"
					}).then(() => {
					  console.log("Alert dialog closed");
					  this.$navigateTo(affichageDefi);
					});
			},
			modifyDefi() {
					this.$navigateTo(editDefi);
			},
			
		},
    };
</script>

<style>

.defiDesc {
	color : black;
	font-size: 10px;
	font-weight: normal;
	
}

</style>