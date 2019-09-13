<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<ScrollView>
					<StackLayout width="100%" height="100%">
						<GridLayout rows="auto" columns="*,50,50">
							<Label row="0" col="0" class="m-b-20 titreTelethon" text="Mes Défis" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/upload.png" @tap="uploadDefis"/>
							<Image row="0" col="2" src="~/assets/icons/add-256.gif" @tap="affichageCat"/>
						</GridLayout>
						<ListView for="item in $store.state.nosDefis" >
						  <v-template>
							<GridLayout rows="auto,*" columns="*,50"  margin="0" @tap="getDefi(item)">
								<Label col="0" raw="0" :text="item.nom" class="defiTitle" />
								<Label col="0" row="1" :text="item.description_courte" class="defiDescription" />
								<Image col="1" row="0" rowSpan="2" src="~/assets/icons/right.png" height="30px"/>
							</GridLayout>
						  </v-template>
						</ListView>
						
						<button class="boutonAction recup" text="Récupérer les défis de ma ville" @tap="recupereDefis" />
						<GridLayout rows="auto" columns="*,50,50">
							<Label row="0" col="0" class="m-b-20 titreTelethon" :text="sousTitreCommune" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/upload.png" @tap="uploadDefisCommune"/>
							<Image row="0" col="2" src="~/assets/icons/add-256.gif" @tap="affichageCatCommune"/> 
						</GridLayout>
									
						<ListView for="item in $store.state.defisCommune" >
						  <v-template>
							<GridLayout rows="*" columns="*,50"  margin="0" @tap="getDefiCommune(item)">
								<GridLayout col="0" verticalAlignment="bottom">
									<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
										<Label :text="item.nom" class="defiTitle" />
										<Label :text="item.description_courte" class="defiDescription" />
									</StackLayout>
								</GridLayout>
								<Image col="1" src="~/assets/icons/right.png" height="30px"/>
							</GridLayout>
						  </v-template>
						</ListView> 
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
	
	export default {
		
		mounted() {
			console.log("mesDefis : mounted : mesDefis "+JSON.stringify(this.$store.state.nosDefis));
			console.log("mesDefis : mounted : defisCommune "+JSON.stringify(this.$store.state.defisCommune));
		},
		data() {
            return {
				defisUpdated : null,
            };
        },
		computed: {
			sousTitreCommune() {
				return "Défis pour : "+this.$store.state.selectedEquipe.commune;
			},

		},
		methods: {
			uploadDefisCommune() {
				confirm({
				  title: "Sauvegarde des défis pour la commune",
				  message: "Confirmez-vous la sauvegarde des défis pour la commune ?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
					// on poste les defi pour la commune sur le serveur 
					axios
						  .post('https://www.telethon.citeyen.com/public/api/defiCommune/upload', {
							defis : this.$store.state.defisCommune,
							commune : this.$store.state.selectedCommune,
						  })
						  .then(response => {
							alert({
							  title: "Sauvegarde des défis",
							  message: "Sauvegarde des défis pour la commune OK",
							  okButtonText: "OK"
							}).then(() => {
							});
						  });
				});
			},
			uploadDefis() {
				confirm({
				  title: "Sauvegarde des défis ",
				  message: "Confirmez-vous la sauvegarde des modifications faites sur les défis (suppressions, modifications et ajouts)?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
				  console.log(result);
				  if (result) {
					console.log("On sauvegarde sur le serveur");
					console.log("defis ALL:"+JSON.stringify(this.$store.state.defisAll));
					this.defisUpdated = this.$store.state.defisAll.filter(item => {
						console.log("defi a upload :"+item.nom+" : "+item.updated); 
						return item.updated == "1";
					});
					console.log("mesDefis : uploadDefi : nombre de défis à MAJ : "+this.defisUpdated.length);
					console.log("mesDefis : uploadDefi : "+JSON.stringify(this.defisUpdated));
					
					axios
						  .post('https://www.telethon.citeyen.com/public/api/defis/upload', {
							defis : this.defisUpdated,
						  })
						  .then(response => {
							console.log("update OK");
							alert({
							  title: "Récupération des défis",
							  message: "Mise à jour des défis à partir du serveur",
							  okButtonText: "OK"
							}).then(() => {
								axios
									.get('https://telethon.citeyen.com/public/api/defis/version')
									.then(response => {
										var versionServeur = response.data.version
										axios
										  .get('https://telethon.citeyen.com/public/api/defis/list')
										  .then(responseList => {
											console.log("Chargement des  defis en base : "+JSON.stringify(responseList.data));
											this.$store.dispatch("reloadDefis",{data : responseList.data,version : versionServeur});
										  });
									})
							});
						})
						.catch(error => {
							console.log("updatete KO : "+error.response);
							alert({
							  title: "Problème de sauvegarde",
							  message: "La sauvegarde n'est pas possible actuellement. Mais vous pouvez continuer à utiliser cette équipe pour saisir les participants et les scores. Vous pourrez faire la sauvegarde plus tard",
							  okButtonText: "OK"
							}).then(() => {
							  console.log("Alert dialog closed");
							  this.$navigateTo(mesDefis);
							});
						})
					
					}
				});
			},
			recupereDefis() {
				console.log("Récupération des défis de la commune");
				let titre = "Les défis de votre commune ont été chargés dans vos défis";
				if (this.$store.state.selectedEquipe.commune.length > 0) {
					console.log("defis de la commune : "+this.$store.state.defisCommune);
					if (this.$store.state.defisCommune.length > 0) {
						console.log("R2cupération des défis OK");
						this.$store.state.nosDefis = this.$store.state.defisCommune;
					}
					else {
						console.log("pas de défis pour la commune en cours");
						titre = "Aucun défi à récupérer";
					}
				}
				else {
					console.log("pas de commune selectionné");
					titre = "Veuillez renseigner votre commune pour pouvoir récupérer les défis";
				}
				alert({
					  title: "Récupération des défis",
					  message: titre,
					  okButtonText: "OK"
					}).then(() => {
					  console.log("Alert dialog closed");
					});
			},
            affichageCat() {
				console.log("liste des challenges");
				this.$store.state.selectedCommune = null;
				this.$store.state.affichageDefiType = "equipe";
                this.$navigateTo(listeChallengesCat);
            },
			affichageCatCommune() {
				console.log("liste des challenges");
				this.$store.state.affichageDefiType = "commune";
				this.$store.state.selectedCommune = this.$store.state.selectedEquipe.commune;
                this.$navigateTo(listeChallengesCat);
			},
			getDefi(item) {
				console.log("affichage du defi : "+item.nom + ": "+item.id);
				this.$store.state.selectedCategorie = this.categorie;
                this.$store.state.selectedDefi = item;
				this.$store.state.selectedCommune = null;
                this.$navigateTo(affichageDefi);
			},
			getDefiCommune(item) {
				console.log("affichage du defi : "+item.nom + ": "+item.id);
				this.$store.state.selectedCategorie = this.categorie;
                this.$store.state.selectedDefi = item;
				this.$store.state.selectedCommune = this.$store.state.selectedEquipe.commune;
                this.$navigateTo(affichageDefi);
			},
			
			getDefiNom(idDefi) {
				var currentDefi = this.$store.state.defis.filter(function(elem) {
					console.log(idDefi+ "---" + elem.id); 
					if (idDefi == elem.id) return elem.nom;
				});
				if(currentDefi.length > 0) {
					return currentDefi[0].Value;
				}
				return "Pas de nom associé au défi";
			},
        },
		
    };
</script>

<style>
.recup {
	margin : 20px;
}
</style>