<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<ScrollView row="1" col="0" >
					<StackLayout width="100%" height="100%">
						<GridLayout rows="auto" columns="*,50,50" >
							<Label row="0" col="0" :text="$store.state.selectedDefi ? $store.state.selectedDefi.nom : 'Vide'" class="sousTitre"/>
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/delete.png" @tap="deleteDefi"/>
							<Image row="0" col="2" class="actionButton" src="~/assets/icons/modify.png" @tap="modifyDefi"/>
						</GridLayout>
						
						<Label class="label" text="Description :"  />
						<Label :text="$store.state.selectedDefi ? $store.state.selectedDefi.description_courte : 'Vide'" class="defiDesc"/>
						<GridLayout v-if="equipeSelected" rows="auto" columns="*,50" >
							<Label row="0" col="0" class="label m-b-20" text="Liste des scores :" textWrap="true" />
							<Image row="0" col="1" src="~/assets/icons/add-256.gif" @tap="addScore"/>
						</GridLayout>
						<ListView  v-if="equipeSelected" for="item in scoreCurrentDefi">
						  <v-template>
							<GridLayout rows="auto" columns="*,50" width="100%" margin="0" @tap="editScore(item)">
								<GridLayout col="0" verticalAlignment="bottom">
									<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
										<Label :text="getProfilNom(item)" class="defiTitle" />
										
									</StackLayout>
								</GridLayout>
								<Label col="1" :text="item.score" class="defiTitle" />
							</GridLayout>
									
						  </v-template>
						</ListView>
						<Button class="boutonAction" v-if="defiPresent($store.state.selectedDefi)" :text="enleverDefiLabel" @tap="enleverDefi"/>
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
			
			equipeSelected() {
				if (this.$store.state.affichageDefiType == "equipe") {
					return true;
				}
				return false;
			},
		},
        data() {
            return {
				scoreCurrentDefi : null,
			}
        },
		mounted() {
			console.log("Chargement des scores");
			this.$store.dispatch("queryScoresEquipe").then(() => {
				console.log("preload : chargement des scores  OK");
			});
			// chargement des scores pour le defi en cours
			this.scoreCurrentDefi = this.$store.state.scoresEquipe.filter(item => {
					console.log("scoreCurrentEquipe :"+item.idDefi+" : "+this.$store.state.selectedDefi.id); 
					return item.idDefi == this.$store.state.selectedDefi.id;
				});
			
        },
		methods: {
			scoreDefi() {
				
				return this.$store.state.score.filter(item => {
					console.log("affichageDefi : scoreDefi : "+item.id +" : "+this.$store.state.selectedDefi.id); 
					return item.id == this.$store.state.selectedDefi.id;
				});
			},
			getProfilNom(item) {
				console.log("affichageDEfi : getProfilNom participants: "+ JSON.stringify(this.$store.state.participants));
				console.log("affichageDEfi : getProfilNom item: "+ JSON.stringify(item));
				let profilEnCours = this.$store.state.participants.find(e => e.id == item.idParticipant);
				return profilEnCours.firstname;
			},
			editScore(item) {
				console.log("Edit d'un score :"+item.id);
				this.$store.state.selectedScore = item;
				this.$navigateTo(addScore);
			},
			addScore() {
				console.log("Ajout d'un score");
				this.$store.state.selectedScore = null;
				this.$navigateTo(addScore);
			},
			defiPresent(defiEncours) {
				if (defiEncours) {
					var idDefiEncours = defiEncours.id
					console.log("on vérifie si le défi est présent");
					console.log("this.$store.state.selectedCommune"+this.$store.state.selectedCommune);
					var filterDefi = []
					if (this.$store.state.selectedCommune) {
						filterDefi = this.$store.state.defisCommune.filter(function(elem) {
							console.log("elem.idDefi : "+elem.id+ "--idDefiEncours--"+idDefiEncours);
							if (elem.id == idDefiEncours) return elem;
						});
					}
					else {
						if (this.$store.state.selectedCommune) {
							console.log("on passe par nosDefis");
							filterDefi = this.$store.state.nosDefis.filter(function(elem) {
								console.log("elem.idDefi : "+elem.id+ "--idDefiEncours--"+idDefiEncours);
								if (elem.id == idDefiEncours) return elem;
							});
						}
						else {
							
						}
					}
					if (filterDefi.length > 0) {
						console.log("le défi a été trouvé");
						return true;
					}
					console.log("le défi n'a pas été trouvé");
					return false;
				}
				else {
					return false;
				}
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
						this.$store.dispatch("deleteDefi", this.$store.state.selectedDefi);
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
					this.$store.dispatch("deleteDefisCurrentCommune", {defi : this.$store.state.selectedDefi});
				}
				else {
					console.log("on enleve de la liste de nosDefis");
					this.$store.dispatch("deleteNosDefis", {defi : this.$store.state.selectedDefi});
				}
				alert({
					  title: "Ajout du défi",
					  message: "Le défis a été supprimé de la liste",
					  okButtonText: "OK"
					}).then(() => {
					  console.log("Alert dialog closed");
					});
			},
			ajouterDefi() {
				if (this.$store.state.selectedCommune) {
					console.log("on ajoute de la liste de defisCommune");
					this.$store.dispatch("insertDefisCurrentCommune", {defi : this.$store.state.selectedDefi,equipe : this.$store.state.currentEquipe});
				}
				else {
					console.log("on ajoute de la liste de nosDefis");
					this.$store.dispatch("insertNosDefis", {defi : this.$store.state.selectedDefi,equipe : this.$store.state.currentEquipe});
				}
				alert({
					  title: "Ajout du défi",
					  message: "Le défis a été ajouté à la liste",
					  okButtonText: "OK"
					}).then(() => {
					  console.log("Alert dialog closed");
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