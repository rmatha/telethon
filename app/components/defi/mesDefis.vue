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
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/save.png"/>
							<Image row="0" col="2" src="~/assets/icons/add-256.gif" @tap="affichageCat"/>
						</GridLayout>
						<FlexboxLayout v-if="!isCoordinateurOrOrganisateur" flexDirection="column">
							<GridLayout rows="20,20" columns="*,50"  margin="0" v-for="defiEquipe in defisEquipeActifs" @tap="getDefi(defiEquipe)">
								<Label col="0" raw="0" :text="defiEquipe.defi.categorie.nom +' : '+defiEquipe.defi.nom" class="defiTitle" />
								<Label col="0" row="1" :text="defiEquipe.defi.defidescription" class="defiDescription" />
								<Image col="1" row="0" rowSpan="2" src="~/assets/icons/right.png" height="30px"/>
							</GridLayout>
						</FlexboxLayout>
						<button class="boutonAction recup" text="Ajouter les défis de ma ville" @tap="recupereDefis" />
						<GridLayout v-if="isCoordinateurOrOrganisateur" rows="auto" columns="*,50,50">
							<Label row="0" col="0" class="m-b-20 titreTelethon" :text="sousTitreCommune" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/save.png" @tap="uploadDefisCommune"/>
							<Image row="0" col="2" src="~/assets/icons/add-256.gif" @tap="affichageCatCommune"/> 
						</GridLayout>
									
						<ListView v-if="isCoordinateurOrOrganisateur" for="item in $store.state.defiCommune.defis" >
						  <v-template>
							<GridLayout rows="*" columns="*,50"  margin="0" @tap="getDefiCommune(item)">
								<GridLayout col="0" verticalAlignment="bottom">
									<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
										<Label :text="item.categorie.nom+' : '+item.nom" class="defiTitle" />
										<Label :text="item.defidescription" class="defiDescription" />
									</StackLayout>
								</GridLayout>
								<Image col="1" src="~/assets/icons/right.png" height="30px"/>
							</GridLayout>
						  </v-template>
						</ListView> 
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
	
	export default {
		
		mounted() {
			console.log("mesDefis : mounted : mesDefis "+JSON.stringify(this.$store.state.selectedEquipe.defis_equipes));
			console.log("mesDefis : mounted : defis commune "+JSON.stringify(this.$store.state.defiCommune));
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
			isCoordinateurOrOrganisateur() {
				if (this.$store.state.selectedEquipe) {
					if (this.$store.state.selectedEquipe.isOrganisateur || this.$store.state.selectedEquipe.isAdmin) {
						return true;
					}
				}
			},
			defisEquipeActifs() {
				if (this.$store.state.selectedEquipe.defis_equipes) {
					return this.$store.state.selectedEquipe.defis_equipes.filter(defiEquipe => {
						return !defiEquipe.delete;
					});
				}
				return;
			},
			nbDefiCommune() {
				if (this.$store.state.defiCommune.defis) {
					return "Nombre de défi sur votre commune : "+this.$store.state.defiCommune.defis.length;
				}
				return "Pas de défi sur votre commune !"; 
			}

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
						  .post('https://www.telethon.citeyen.com/public/api/defisCommune/upload', {
							defis : this.$store.state.defiCommune,
							commune : this.$store.state.selectedCommune,
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
				console.log("Récupération des défis de la commune");
				let titre = "Les défis de votre commune ont été chargés dans vos défis";
				if (this.$store.state.selectedEquipe) {
					console.log("defis de la commune : "+this.$store.state.defiCommune);
					if (this.$store.state.defiCommune.defis) {
						if (this.$store.state.defiCommune.defis.length > 0) {
							console.log("R2cupération des défis OK");
							this.$store.dispatch("recupereDefis");
						}
						else {
							console.log("pas de défis pour la commune en cours");
							titre = "Aucun défi à récupérer sur la commune de l'équipe";
						}
					}
					else {
						console.log("pas de défis pour la commune en cours");
						titre = "Aucun défi à récupérer sur la commune de l'équipe";
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
				console.log("liste des defi");
				this.$store.state.selectedCommune = null;
				this.$store.state.affichageDefiType = "equipe";
                this.$navigateTo(listeChallengesCat);
            },
			affichageCatCommune() {
				console.log("liste des defis commune");
				this.$store.state.affichageDefiType = "commune";
				this.$store.state.selectedCommune = this.$store.state.selectedEquipe.commune;
                this.$navigateTo(listeChallengesCat);
			},
			getDefi(item) {
				console.log("MESDEFIS : GETDefi : item : "+JSON.stringify(item));
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