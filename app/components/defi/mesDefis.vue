<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<ScrollView>
					<StackLayout width="100%" height="100%">
						<GridLayout v-if="!isCoordinateurOrOrganisateur" rows="auto" columns="*,50,50">
							<Label row="0" col="0" class="m-b-20 titreTelethon" text="Mes Défis" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/save.png" @tap="uploadEquipe"/>
							<Image row="0" col="2" src="~/assets/icons/add-256.gif" @tap="affichageCat"/>
						</GridLayout>
						<FlexboxLayout v-if="!isCoordinateurOrOrganisateur" flexDirection="column">
							<GridLayout rows="20,20" columns="*,50"  margin="0" v-for="defiEquipe in defisEquipeActifs" @tap="getDefi(defiEquipe)">
								<Label col="0" raw="0" :text="defiEquipe.defi.categorie.nom +' : '+defiEquipe.defi.nom" class="defiTitle" />
								<Label col="0" row="1" :text="defiEquipe.defi.defidescription" class="defiDescription" />
								<Image col="1" row="0" rowSpan="2" src="~/assets/icons/right.png" height="30px"/>
							</GridLayout>
						</FlexboxLayout>
						<button v-if="!isCoordinateurOrOrganisateur" class="boutonAction recup" text="Ajouter les défis de ma ville" @tap="recupereDefis" />
						<GridLayout v-if="isCoordinateurOrOrganisateur" rows="auto,*" columns="*,50,50">
							<Label row="0" col="0" class="m-b-20 titreTelethon" :text="sousTitreCommune" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/save.png" @tap="uploadDefisCommune"/>
							<Image row="0" col="2" src="~/assets/icons/add-256.gif" @tap="affichageCatCommune"/> 
							<StackLayout row="1" col="0" colSpan="3" v-if="$store.state.defiCommune" >
								<ListView for="item in $store.state.defiCommune.defis" height="auto">
								  <v-template>
									<GridLayout rows="*" columns="*,50"  margin="0" @tap="getDefiCommune(item)">
										<GridLayout col="0" verticalAlignment="bottom">
											<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
												<Label :text="item.defi.categorie.nom+' --- '+ item.defi.nom" class="defiTitle" />
												<Label :text="item.defi.description" class="defiDescription" />
											</StackLayout>
										</GridLayout>
										<Image col="1" src="~/assets/icons/right.png" height="30px"/>
									</GridLayout>
								  </v-template>
								</ListView> 
							</StackLayout>
						</GridLayout>
									
						
						<StackLayout v-else>
							<Label :text="nbDefiCommune" class="defiTitle"/>
						</StackLayout>
					</StackLayout>
				</ScrollView>
			</StackLayout>
		</DockLayout>
		
		
	</page>
</template>

<script>
	import listeChallengesCat from "../categorie/listCategorie";
	import affichageDefi from "./affichageDefi";
	import preload from "../preload";
	import axios from 'axios';
	import mesDefis from './mesDefis';
	
	export default {
		
		mounted() {
			
			console.log("mesDefis : mounted : selectedEquipe ");
			console.log(JSON.stringify(this.$store.state.selectedEquipe));
			console.log("mesDefis : mounted : defis  commune ");
			console.log(JSON.stringify(this.$store.state.defiCommune.defis));
		},
		data() {
            return {
				defisUpdated : null,
            };
        },
		computed: {
			isCoordinateurOrOrganisateur() {
				var isCoordOrgan = false;
				console.log("organisateur : "+this.$store.state.selectedEquipe.organisateur);
				console.log("admin : "+this.$store.state.selectedEquipe.admin);
				if (this.$store.state.selectedEquipe) {
					if (this.$store.state.selectedEquipe.organisateur || this.$store.state.selectedEquipe.admin) {
						isCoordOrgan = true;
						console.log("on passe isCoordOrgan à true");
					}
				}
				return isCoordOrgan;
			},
			
			sousTitreCommune() {
				return "Défis pour : "+this.$store.state.selectedEquipe.commune;
			},
			
			defisEquipeActifs() {
				if (this.$store.state.selectedEquipe.defiEquipes) {
					return this.$store.state.selectedEquipe.defiEquipes.filter(defiEquipe => {
						return !defiEquipe.delete;
					});
				}
				console.log("Pas de défis pour l'équipe");
				return null;
			},
			nbDefiCommune() {
				if (this.$store.state.defiCommune.defis) {
					return "Nombre de défi sur votre commune : "+this.$store.state.defiCommune.defis.length;
				}
				return "Pas de défi sur votre commune !"; 
			}

		},
		methods: {
			uploadEquipe() {
				confirm({
				  title: "Sauvegarde de l'équipe et les défis",
				  message: "Confirmez-vous la sauvegarde de l'équipe sur le serveur ?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
				  //console.log(result);
				  if (result) {
					//console.log("On sauvegarde sur le serveur");
					//console.log("Equipe :"+JSON.stringify(this.$store.state.selectedEquipe));
					//console.log("Participants :"+JSON.stringify(this.$store.state.participants));
					axios
						  .post('https://www.telethon.citeyen.com/public/api/equipes/uploadEquipe', {
							Equipe : this.$store.state.selectedEquipe
						  })
						  .then(response => {
								//console.log("update OK");
								// maintenant on récupère les informations sur le serveur pour être synchro
							
							
								// mise a jour de la version locale à partir de la version serveur
								let params = {};
								params["commune"] = this.$store.state.selectedEquipe.commune;
								params["nom"] = this.$store.state.selectedEquipe.nom;
								//console.log("Appel suivant synchro");
								axios
								.get('https://telethon2020.citeyen.com/api/equipe/info', {params : params})
								.then(response => {
									this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data.equipe,"scores" : response.data.scores});
									alert({
									  title: "Chargement de l'équipe",
									  message: "Synchronisation de l'équipe avec le serveur OK",
									  okButtonText: "OK"
									});
								})
								.catch(error => {
									//console.log("updatete KO : "+error);
									alert({
									  title: "Problème de sauvegarde",
									  message: "La synchronisation avec le serveur est KO. Mais vous pouvez continuer à utiliser cette équipe pour saisir les participants et les scores. Vous pourrez faire la sauvegarde plus tard",
									  okButtonText: "OK"
									}).then(() => {
									  //console.log("Alert dialog closed");
									});
								});
						  })
						  .catch(error => {
							//console.log("updatete KO : "+error);
							alert({
							  title: "Problème de sauvegarde",
							  message: "La sauvegarde n'est pas possible actuellement. Mais vous pouvez continuer à utiliser cette équipe pour saisir les participants et les scores. Vous pourrez faire la sauvegarde plus tard",
							  okButtonText: "OK"
							}).then(() => {
							  //console.log("Alert dialog closed");
							  this.$navigateTo(mesDefis);
							});
						  })
					
				  }
				});
			},
			uploadDefisCommune() {
				console.log("defis : "+JSON.stringify(this.$store.state.defiCommune));
				console.log("commune : "+JSON.stringify(this.$store.state.selectedCommune));
				confirm({
				  title: "Sauvegarde des défis pour la commune",
				  message: "Confirmez-vous la sauvegarde des défis pour la commune ?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
					// on poste les defi pour la commune sur le serveur 
					axios
						  .post('https://www.telethon2020.citeyen.com/api/defiCommune/upload', {
							defis : this.$store.state.defiCommune.defis,
							commune : this.$store.state.selectedEquipe.commune,
						  })
						  .then(response => {
							alert({
							  title: "Sauvegarde des défis",
							  message: "Sauvegarde des défis pour la commune OK",
							  okButtonText: "OK"
							});
						  });
				});
			},
			
			recupereDefis() {
				//console.log("Récupération des défis de la commune");
				let titre = "Les défis de votre commune ont été chargés dans vos défis";
				if (this.$store.state.selectedEquipe) {
					//console.log("defis de la commune : "+this.$store.state.defiCommune);
					if (this.$store.state.defiCommune.defis) {
						if (this.$store.state.defiCommune.defis.length > 0) {
							//console.log("R2cupération des défis OK");
							this.$store.dispatch("recupereDefis");
							this.$navigateTo(mesDefis);
						}
						else {
							//console.log("pas de défis pour la commune en cours");
							titre = "Aucun défi à récupérer sur la commune de l'équipe";
						}
					}
					else {
						//console.log("pas de défis pour la commune en cours");
						titre = "Aucun défi à récupérer sur la commune de l'équipe";
					}
				}
				else {
					//console.log("pas de commune selectionné");
					titre = "Veuillez renseigner votre commune pour pouvoir récupérer les défis";
				}
				alert({
					  title: "Récupération des défis",
					  message: titre,
					  okButtonText: "OK"
					}).then(() => {
					  //console.log("Alert dialog closed");
					});
			},
            affichageCat() {
				//console.log("liste des defi");
				this.$store.state.selectedCommune = null;
				this.$store.state.affichageDefiType = "equipe";
                this.$navigateTo(listeChallengesCat);
            },
			affichageCatCommune() {
				//console.log("liste des defis commune");
				this.$store.state.affichageDefiType = "commune";
				this.$store.state.selectedCommune = this.$store.state.selectedEquipe.commune;
                this.$navigateTo(listeChallengesCat);
			},
			getDefi(item) {
				//console.log("MESDEFIS : GETDefi : item : "+JSON.stringify(item));
				this.$store.state.selectedCategorie = item.categorie
				this.$store.state.selectedDefi = item;
				this.$store.state.selectedCommune = null;
                this.$navigateTo(affichageDefi);
			},
			getDefiCommune(item) {
				this.$store.state.selectedCategorie = item.categorie
				this.$store.state.selectedDefi = item;
				this.$store.state.selectedCommune = this.$store.state.selectedEquipe.commune;
                this.$navigateTo(affichageDefi);
			},
        },
		
    };
</script>

<style>
.recup {
	margin : 20px;
}
</style>