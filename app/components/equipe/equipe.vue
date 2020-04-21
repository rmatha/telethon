<template>
	<page class="page" actionBarHidden="true">
		  <DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
		<StackLayout dock="center" class="root" >
			<RadSideDrawer ref="drawer">
				<StackLayout ~drawerContent class="sideStackLayout">
					<StackLayout class="sideTitleStackLayout">
						<Label text="Menu" style="horizontal-align: center"></Label>
					</StackLayout>
					<StackLayout class="sideStackLayout">
						<GridLayout rows="100,100,*" columns="*" >
							<Label row="0" col="0" text="Créer une nouvelle équipe" class="sideLabel sideLightGrayLabel"  @tap="creerEquipe"></Label>
							<Label row="1" col="0" text="sélectionner une équipe existante" class="sideLabel"  @tap="changeEquipe"></Label>
							<Label row="2" col="0" text="Fermer" color="lightgray" padding="10" style="horizontal-align: center" @tap="onCloseDrawerTap"></Label>
						</GridLayout>
					</StackLayout>
					
				</StackLayout>
				<StackLayout ~mainContent>
					<StackLayout class="m-20"  width="100%" height="100%">
					<!--<GridLayout rows="200" columns="*" >
						<Image row="0" col="0" v-if="imageSrc" :src="imageSrc" class="imageEquipe" @tap="takePicture"></Image>
						<Label  row="0" col="0" v-else text="Appuyer pour changer votre image d'équipe" @tap="takePicture" />
					</GridLayout>-->
						<StackLayout v-if="$store.state.selectedEquipe" >
							<GridLayout rows="auto" columns="50,*,50" >
								<Image row="0" col="0" class="actionButton" src="~/assets/menu_icon.png" @tap="onOpenDrawerTap"/>
								<Label row="0" col="1" class="m-b-20 titreTelethon" :text="titreEquipe" textWrap="true" />
								<Image v-if="$store.state.updateEquipe" row="0" col="2" class="actionButton" src="~/assets/icons/save.png" @tap="uploadEquipe"/>
							</GridLayout>
							<Label text="Votre équipe est Organisateur" v-if="$store.state.selectedEquipe.organisateur"  />
							<Label text="Votre équipe est Coordinateur " v-if="$store.state.selectedEquipe.admin" />
							<Label class="label" text="Commune des défis Téléthon" />
							<Label class="valeur" :text="$store.state.selectedEquipe.commune" />

							
						</StackLayout>
						<StackLayout v-else>
							<GridLayout rows="50,100,*" columns="50,*">
								<Image row="0" col="0" class="actionButton" src="~/assets/menu_icon.png" @tap="onOpenDrawerTap"/>
								<Image row="1" col="0" src="~/assets/fleche_rouge2.png" />
								<Label row="2" col="0" colSpan="2" text="! Pas d'équipe sélectionnée ! " textWrap="true" class="valeur"/>
							</GridLayout>
						</StackLayout>

						
						<StackLayout  v-if="$store.state.selectedEquipe">
							<GridLayout rows="auto" columns="*,50" >
								<Label row="0" col="0" class="label" text="Liste dess participants de l'équipe" textWrap="true" />
								<Image row="0" col="1" src="~/assets/icons/addUser.png" @tap="addParticipant"/>
							</GridLayout>
							
							
						</StackLayout>
						<FlexboxLayout v-if="$store.state.selectedEquipe" flexDirection="column">
							<GridLayout rows="40" columns="*" v-for="(participant, index) in participantsActifs" :key="index">
						
								<Label :text="libelleProfil(participant)" class="valeur" @tap="editParticipant(participant)"/>
							</GridLayout>
						</FlexboxLayout>
						
						<StackLayout v-else >
							<GridLayout v-if="paticipantsActifs" rows="100,*" columns="auto,*">
								<Image row="0" col="0" src="~/assets/fleche_rouge2.png" @tap="changeEquipe"/>
								<Label row="1" col="0" colSpan="2" text="! Pas de participants inscrits ! " class="valeur" @tap="editParticipant(participant)"/>
							</GridLayout>
						</StackLayout>
						
						
					</StackLayout>
				</StackLayout>
			</RadSideDrawer>


				
				
		
		</StackLayout>
	</DockLayout>
	</page>
</template>

 
<script>

	
	const connectivity = require("connectivity");
	import profil from "./profil";
	import changeEquipe from "./changeEquipe";
	import { Image } from "tns-core-modules/ui/image";
	/*import * as camera from "nativescript-camera";*/
	import store from "../store/teleStore.js";
	const imageSourceModule = require("tns-core-modules/image-source");
	const fileSystemModule = require("tns-core-modules/file-system");
	import axios from 'axios'
	
    export default {
        mounted() {
			console.log("Equipe en cours est :"+JSON.stringify(this.$store.state.selectedEquipe));
			if (this.$store.state.selectedEquipe) {
				//console.log("Liste des participants : "+JSON.stringify(this.$store.state.selectedEquipe.participants));
				//console.log("nombre des participants : "+this.$store.state.selectedEquipe.participants.length);
			}
			// vérification des version de la version de l'équipe sur le serveur 
			const connectionType = connectivity.getConnectionType();
			//console.log("etat de la connexion : "+connectionType);
			if (connectionType !== connectivity.connectionType.none) {
				//console.log("On peut récupérer la version de l'équipe sur le serveur");
				if (this.$store.state.selectedEquipe) {
					//console.log("Version equipe locale : "+this.$store.state.selectedEquipe.version);
					let params = {};
					params["commune"] = this.$store.state.selectedEquipe.commune;
					params["nom"] = this.$store.state.selectedEquipe.nom;
								
					axios
						.get('https://telethon.citeyen.com/public/api/equipes/version', {params : params})
						.then(response => {
							//console.log("Version de l'équipe sur le serveur : "+response.data.version);
							let versionEquipeServeur = response.data.version;
							if (versionEquipeServeur > this.$store.state.selectedEquipe.version) {
								//console.log("on doit demander si on récupère les nouveaux participants du serveur");
								confirm({
									title: "Mise à jour de l'équipe",
									message: "Une version plus récente a été trouvé sur le serveur. Voulez-vous récupérer la mise à jour ?",
									okButtonText: "OUI",
									cancelButtonText: "NON"
								}).then(result => {
									if (result) {
										axios
										.get('https://telethon.citeyen.com/public/api/equipes/info', {params : params})
										.then(response => {
											this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data});
											alert({
											  title: "Chargement de l'équipe",
											  message: "Synchronisation de l'équipe avec le serveur OK",
											  okButtonText: "OK"
											});
											
										})
										.catch(error => {
											//console.log("updatete KO  : "+error);
											alert({
											  title: "Problème de sauvegarde",
											  message: "La synchronisation avec le serveur est KO. Mais vous pouvez continuer à utiliser cette équipe pour saisir les participants et les scores. Vous pourrez faire la sauvegarde plus tard",
											  okButtonText: "OK"
											}).then(() => {
											  //console.log("Alert dialog closed");
											});
										});
										this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data});
									}
								});
								
							}
						})
						.catch(error => console.log("equipe : mounted : ERROR : "+error));
						
							
				}
			
			};


        },
		computed: {			
			titreEquipe() {
				var reponse = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
				return reponse;
			},
			participantsActifs() {
				if (this.$store.state.selectedEquipe.participants) {
					return this.$store.state.selectedEquipe.participants.filter(participant => {
						return !participant.delete;
					});
				};
				return null;
			},
        },

	

		data() {
            return {
				imageSrc : null,
				LibelleAdmin : 0,
            };
        },
		
        methods: {
			onNavigationButtonTap() {
				Frame.topmost().goBack();
			},
			onOpenDrawerTap() {
				this.$refs.drawer.showDrawer();
			},
			onCloseDrawerTap() {
				this.$refs.drawer.closeDrawer();
			},
			takePicture: function() {
			  // TEST
			  camera.requestPermissions();
			  camera
				.takePicture({ width: 700, height: 700, keepAspectRatio: true })
				.then(
				  imageAsset => {
					//console.log("Result is an image asset instance");
					this.imageSrc = imageAsset;
					const source = new imageSourceModule.ImageSource();
					source.fromAsset(imageAsset).then(imageSource => {
						const folder = fileSystemModule.knownFolders.documents().path;
						//console.log("folder : "+folder);
						const fileName = "picture.png";
						const path = fileSystemModule.path.join(folder,fileName);
						const picsaved = imageSource.saveToFile(path, "png");

						if (picsaved) {
							//console.log("Saved");
						}
						else {
							//console.log("picture NOT saved");
						}
					});
				  },
				  error => console.log(error)
				)
				.catch(err => {
				  //console.log("Error -> " + err.message);
				});
			},
			libelleProfil(participantTemp) {
				return participantTemp.nom;
			},
			addParticipant(participantTemp) {
				//console.log("Ajout d'un participant");
				this.$store.dispatch("setSelectedParticipant",{"participant" : null});
				this.$navigateTo(profil);
			},
			editParticipant(participantTemp) {
				//console.log("edition du aprticipant :"+participantTemp);
				this.$store.dispatch("setSelectedParticipant",{"participant" : participantTemp});
				this.$navigateTo(profil);
			},
			
			changeEquipe() {
				//console.log("on change d'équipe");
				this.$navigateTo(changeEquipe, {
					transition: {
						name:'fade',
						duration: 200
					},
					props: {
						type : "search"
					}
				});
			},

			creerEquipe() {
				//console.log("on change d'équipe");
				this.$navigateTo(changeEquipe, {
					transition: {
						name:'fade',
						duration: 200
					},
					props: {
						type : "new"
					}
				});
			},

			uploadEquipe() {
				confirm({
				  title: "Sauvegarde de l'équipe",
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
								.get('https://telethon.citeyen.com/public/api/equipes/info', {params : params})
								.then(response => {
									this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data});
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
			
			
            
        }
    };
</script>

<style>
.labelVille {
	color : white;
}
.titreTelethon {
	font-size : 38px;
}
.red {
	color: #ff0000;
}

.green {
	color : #00ff00;
}

    .home-panel {
        vertical-align: center;
        font-size: 20;
        margin: 15;
    }


</style>