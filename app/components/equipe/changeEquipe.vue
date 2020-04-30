<template>
	<page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root cadre" >
				<RadSideDrawer ref="drawer">
					<StackLayout ~drawerContent class="sideStackLayout">
						
						<StackLayout class="sideDrawerTitre">
							<Label text="Menu"></Label>
						</StackLayout>
						<StackLayout class="sideStackLayout">
							<GridLayout rows="50,50,*" columns="*" >
								<Label row="0" col="0" text="Créer une nouvelle équipe" class="upLine"  @tap="nouvelleEquipe"></Label>
								<Label row="1" col="0" text="sélectionner une équipe existante" class="upLine"  @tap="equipeExistante"></Label>
								<Label row="2" col="0" text="Fermer" class="upLine textFermer" @tap="onCloseDrawerTap"></Label>
							</GridLayout>
						</StackLayout>
						
					</StackLayout>
					<ScrollView ~mainContent height="100%">
						<StackLayout>  
							
							<StackLayout class="cadre" v-if="isNouvelleEquipe" >
								<GridLayout rows="70" columns="50,*">
									<Image row="0" col="0" class="actionButton" src="~/assets/menu_icon.png" @tap="onOpenDrawerTap"/>
									<Label row="0" col="1" class="titre" horizontalAlignment="center" text="Nouvelle équipe" textWrap="true" />
									
								</GridLayout>
								<Label class="label" text="Nom de l'équipe" />
								<TextField class="textfield" hint="Ex : the killers..." v-model="input.nom"/>
								<Label ref="labelVille" class="label" text="Ville du challenge Téléthon"  />
								<TextField class="textfield" ref="textFieldVille" @textChange="onTextChange" @blur="lostFocus" v-model="input.commune"/>
								<ScrollView v-if="affichageVilles" height="500">
									<StackLayout backgroundColor="#3c495e" >
										<GridLayout v-for="ville in villes" rows="40" columns="*"  >
											<Label :text="ville.nom" @tap="selectVille(ville.nom,ville.code)" class="labelVille"/>
										</GridLayout>
									</StackLayout>
								</ScrollView>
								<Label class="label"  text="Mot de passe" />
								<TextField class="textfield" v-model="input.code"/>
								<GridLayout rows="auto,auto" columns="*,50" marginBottom="5">
									<Label row="0" col="0" text="Equipe organisatrice" fontSize="14" class="labelCheck" />
									<Switch row="0"col="1" checked="false" class="switch-light" v-model="input.organisateur" />
									<Label row="1" col="0" text="Equipe de coordination Téléthon" fontSize="14" class="labelCheck" />
									<Switch row="1"col="1" checked="false" class="switch-light" v-model="input.admin" />
									
								</GridLayout>
								<Button text="Créer" horizontalAlignment="center" @tap="creerEquipe"/>
							</StackLayout>
							<StackLayout v-if="isExistanteEquipe" >
								<GridLayout rows="70" columns="50,*">
									<Image row="0" col="0" class="actionButton" src="~/assets/menu_icon.png" @tap="onOpenDrawerTap"/>
									<Label row="0" col="1" class="titre" horizontalAlignment="center" text="Sélection de l'équipe" textWrap="true" />
									
								</GridLayout>
								<Label ref="labelVille" class="label" text="Ville du challenge Téléthon"  />
								<TextField class="textfield" ref="textFieldVille" @textChange="onTextChange" v-model="input.commune"/>
								<ScrollView v-if="affichageVilles" height="500">
									<StackLayout >
										<GridLayout v-for="ville in villes" rows="40" columns="*">
											<Label :text="ville.nom" @tap="selectVille(ville.nom,ville.code)" class="labelVille"/>
										</GridLayout>
									</StackLayout>
								</ScrollView>
								<ListPicker v-if="affichageEquipes" ref="equipeEnCours" :items="equipesVille" textField="nom" @tap="selectEquipeExistante()"  />
								<Label v-else textWrap="true" text="Il n'existe pas encore d'équipe sur cette commune. Utiliser 'Créer une équipe'" />
								
							</StackLayout>
						</StackLayout>
					</ScrollView>
				</RadSideDrawer>
			</StackLayout>
			
		</DockLayout>
		
		
	</page>
</template>
 
<script>

	import equipe from "./equipe";
	import axios from 'axios';
	import villesRef from "@/assets/villes.json"
	
	
    export default {
        mounted() {
			if (this.type == "new") {
				this.isNouvelleEquipe = true;
			};
			if (this.type == "search") {
				this.isExistanteEquipe = true;
			};
        },
		computed: {	
			getClassButtonNouvelleEquipe () {
				//console.log("isNouvelleEquipe : "+this.isNouvelleEquipe);
				return this.isNouvelleEquipe ? "active" : "nonActive";
			},
			getClassButtonExistanteEquipe () {
				//console.log("isExistanteEquipe : "+this.isExistanteEquipe);
				return this.isExistanteEquipe ? "active" : "nonActive";
			},
			isOrganisateur(){
				if (this.input.admin == 1){
					//console.log("Le flag orga est vert");
					return(true);
					
				}
			},
        },
		props: ['type'],
		data() {
            return {
                isNouvelleEquipe : false,
				isExistanteEquipe : false,
				input: {
					nom: "",
                    commune: "",
					code : "",
					admin : false,
					organisateur : false,
					version : 0,
				},
				villesRef: [],
                villes: [],
				affichageVilles : false,
				affichageEquipes : false,
				isValidVille : false,
				equipesVille : [],
				equipeSelected : "",
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
			updateOrganisateur() {
				this.input.admin = 0;
				prompt({
				  title: "Code de l'équipe",
				  message: "Veuillez saisir le code des organisateurs qui vous a été donné par l'équipe de coordination téléthon :",
				  okButtonText: "OK",
				  cancelButtonText: "Cancel",
				  defaultText: "",
				}).then(result => {
					//console.log(`Dialog result: ${result.result}, text: ${result.text}`);
					if (result.result & (result.text == "16340")) {
						//console.log("c'est un orga");
						this.input.organisateur = true;
					}
					else {
						alert("Erreur mauvais code");
						//console.log("ce n'est pas un orga");
					}
					
				});
				
				
			},

			updateCoordinateur() {
				this.input.admin = 0;
				prompt({
				  title: "Code de l'équipe",
				  message: "Veuillez saisir le code des organisateurs qui vous a été donné par l'équipe de coordination téléthon:",
				  okButtonText: "OK",
				  cancelButtonText: "Cancel",
				  defaultText: "",
				}).then(result => {
					//console.log(`Dialog result: ${result.result}, text: ${result.text}`);
					if (result.result & (result.text == "16340")) {
						//console.log("c'est un admin");
						this.input.admin = true;
					}
					else {
						alert("Erreur mauvais code");
						//console.log("ce n'est pas une corrdination");
					}
					
				});
				
				
			},
			
			

			selectEquipeExistante() { 
				// récupération de la commune sélectionnée
				let indexEquipe = this.$refs.equipeEnCours.nativeView;
				this.equipeSelected = this.equipesVille[indexEquipe.selectedIndex];
				//console.log("selectEquipeExistante : sélectionde l'équipe :"+this.equipeSelected.nom+" : sur la commune : "+this.equipeSelected.commune+ " est le code : "+ this.equipeSelected.code);
				prompt({
				  title: "Code de l'équipe",
				  message: "Veuillez saisir le code de l'équipe:",
				  okButtonText: "OK",
				  cancelButtonText: "Cancel",
				  defaultText: "",
				}).then(result => {
					if (result.result & (result.text == this.equipeSelected.code)) {
						//console.log("selection ok");
						// il faut récupérer les informations de l'équipe en cours sur le serveur 
						let params = {};
						params["commune"] = this.equipeSelected.commune;
						params["nom"] = this.equipeSelected.nom;
						axios
						.get('https://telethon.citeyen.com/public/api/equipes/info', {params : params})
						.then(response => {
							this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data});
							// chargement des defis de la commune 
							//console.log("CHANGEEQUIPE : creerEquipe :MAJ des defis communes à partir du serveur");
							let params = {};
							params["commune"] = this.$store.state.selectedEquipe.commune;
							axios
								.get('https://telethon.citeyen.com/public/api/defisCommune/list', {params : params})
								.then(responseList => {
									//console.log("Chargement des defis de la commune en base : "+JSON.stringify(responseList.data));
									this.$store.dispatch("reloadDefisCommune",{"defis" : responseList.data,"version" : null});
								});
							alert({
							  title: "Sélection d'équipe",
							  message: "Sélection de l'équipe validée",
							  okButtonText: "OK"
							}).then(() => {
							  this.$navigateTo(equipe);
							});
							
						});
					}
					else {
						//console.log("selction equipe KO");
						alert({
						  title: "Sélection d'équipe",
						  message: "Le code n'est pas correct",
						  okButtonText: "OK"
						}).then(() => {
						  //console.log("pas le bon code ! ");
						});
					}
				});
				
			},
			creerEquipe() {
				if ((this.input.nom.length <= 0) || (this.input.commune.length <= 0) || (this.input.code.length <= 0)) {
					alert({
							  title: "Création d'équipe",
							  message: "Veuillez saisir un nom, une commune et un mot de passe",
							  okButtonText: "OK"
							});
					return;
				}
				let isEquipeExisteDeja = this.$store.state.equipes.filter(equipe => {
					if (( this.input.commune == equipe.commune) & ( this.input.nom == equipe.nom)) {
						return true;
					}
					return false;
				});
				if (isEquipeExisteDeja.length > 0) {
					alert({
					  title: "Création d'équipe impossible",
					  message: "Le nom de cette équipe est déjà utilisé sur cette commune. Utilisez un autre nom ou appuyez sur 'Equipe existante' pour sélectionner cette équipe",
					  okButtonText: "OK"
					}).then(() => {
					  //console.log("Alert dialog closed");
					});
				}
				else {
					//console.log("on peut créer la nouvelle équipe : "+JSON.stringify(this.input));
					this.$store.dispatch("newEquipe", {"equipe" :  this.input}).then(() => {
						// chargement des defis de la commune 
						//console.log("CHANGEEQUIPE : creerEquipe :MAJ des defis communes à partir du serveur");
						let params = {};
						params["commune"] = this.$store.state.selectedEquipe.commune;
						axios
							.get('https://telethon.citeyen.com/public/api/defisCommune/list', {params : params})
							.then(responseList => {
								//console.log("Chargement des defis de la commune en base : "+JSON.stringify(responseList.data));
								this.$store.dispatch("reloadDefisCommune",{"defis" : responseList.data,"version" : null});
							});
						alert({
						  title: "Création d'équipe confirmée",
						  message: "Vous allez être redirigé pour intégrer les membres à votre équipe",
						  okButtonText: "OK"
						}).then(() => {
							this.updateEquipe = true;
							this.$navigateTo(equipe);
						});
					});
				};
				
				
			},
			nouvelleEquipe() {
				this.isNouvelleEquipe = true;
				this.isExistanteEquipe = false;
				this.affichageVilles = false;
				this.$refs.drawer.closeDrawer();
			},
			equipeExistante() {
				this.isNouvelleEquipe = false;
				this.isExistanteEquipe = true;
				this.affichageVilles = false;
				this.$refs.drawer.closeDrawer();
			},
			selectVille(nom,code) {
				//console.log("Sélection de la ville"+nom);
				//console.log("Liste des equipes :"+JSON.stringify(this.$store.state.equipes));
				let textField = this.$refs.textFieldVille.nativeView;
                textField.text = nom;
				this.affichageVilles = false; 
				this.equipesVille = this.$store.state.equipes.filter(equipe => {
					return nom == equipe.commune;
				});
				if (this.equipesVille.length > 0) {
					this.affichageEquipes = true;
				}
				else {
					this.affichageEquipes = false; 
				};
				this.isValidVille = true;
				this.$refs.textFieldVille.nativeView.dismissSoftInput()
			},
            onTextChange: function() {
				this.isValidVille = false;
				// filtre de la liste villes 
				this.villes = villesRef.filter(ville => {
					return ville.nom.toLowerCase().indexOf(this.input.commune.toLowerCase()) > -1
				})
				if (this.input.commune.length > 2) {
					this.affichageVilles = true;
				}
				else {
					this.affichageVilles = false;
				};
                //ApplicationSettings.setString(textField.name, textField.text);
                //this.firstTx = textField.text;
            },
			lostFocus: function() {
				if (!this.isValidVille) {
					alert({
					  title: "Sélection de la commune",
					  message: "Il faut saisir une commune parmi la liste des communes qui s'affiche en fonction de votre saisie",
					  okButtonText: "OK"
					}).then(() => {
					  this.input.commune = "";
					});
				}
			},
        }
    };
</script>

<style>

.imageCheck {
	width : 100px;
	margin : 20px;
}

.labelCheck {
	margin : 20px;
}

.menuEquipe {
	background-color : #fff;
	height : 20px;
	vertical-align : bottom;
}

.active {
	background-color : white;
	color : #fbc62d;
}

.nonActive {
	background-color : #fbc62d;
	color : white;
}
</style>