<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<RadSideDrawer ref="drawer">
				<StackLayout ~drawerContent class="sideStackLayout">
					<StackLayout class="sideDrawerTitre">
						<Label text="Menu"></Label>
					</StackLayout>
					<StackLayout class="sideStackLayout">
						<GridLayout rows="50,50,50,*" columns="*" >
							<Label row="0" col="0" text="Modifier la catégorie" class="upLine"  @tap="editCat"></Label>
							<Label row="1" col="0" text="Supprimer la catégorie" class="upLine"  @tap="deleteCategorie"></Label>
							<Label row="2" col="0" v-if="$store.state.updateDefi" text="Sauvegarder la catégorie" class="upLine"  @tap="uploadDefis"></Label>
							<Label row="3" col="0" text="Fermer" class="upLine textFermer" @tap="onCloseDrawerTap"></Label>
						</GridLayout>
					</StackLayout>
				</StackLayout>
				<StackLayout ~mainContent dock="center" class="root" >
					<GridLayout class="borderBottom ml-10" rows="auto" columns="50,*">
						<Image row="0" col="0" class="actionButton" src="~/assets/menu_icon.png" @tap="onOpenDrawerTap"/>
						<Label row="0" col="1" class="titre" :text="$store.state.selectedCategorie.nom" textAlignment="center" />
					</GridLayout>
					<GridLayout  rows="auto" columns="*,50">
						<Label row="0" col="0" class="titre mt-20" text="Liste des défis" textAlignment="center" fontSize="30"/>
						<Image row="0" col="1" v-if="$isCoordinateurOrOrganisateur" src="~/assets/icons/add-256.gif" @tap="addDefi"/>
					</GridLayout>
					<ListView key="$store.state.defis" for="item in defisCat" height="100%" >
					  <v-template>
						<GridLayout rows="*" columns="*,50" width="100%" margin="0" @tap="getDefi(item)">
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
			</RadSideDrawer>
		</DockLayout>
	</page>
	
	
</template>

<script>
	import affichageDefi from "./affichageDefi";
	import editDefi from "./editDefi";
	import store from "../store/teleStore.js";
	import editCategorie from "../categorie/addCategorie";
	
	export default {
		computed: {
			defisCat () {
				return this.$store.state.defis.filter(item => {
					//console.log("ListDefiCat : defiCat :"+item.categorie.nom+" : "+this.$store.state.selectedCategorie.nom); 
					return item.categorie.nom == this.$store.state.selectedCategorie.nom;
				});
			},
			
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
		},
        data() {
            return {
				
			}
        },
		mounted() {
			console.log("listDefisCat : mounted : defis "+JSON.stringify(this.$store.state.defis));
			
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
			getDefi(item) {
				//console.log("affichage du defi");
				this.$store.state.selectedDefi = {};
				this.$store.state.selectedDefi.defi = item;
				//console.log("affichage du defi"+JSON.stringify(item));
				this.$navigateTo(affichageDefi);
			},
			addDefi() {
				this.$store.state.selectedDefi = null;
				this.$navigateTo(editDefi);
			}, 
			editCat() {
				this.$navigateTo(editCategorie);
				
			},
			deleteCategorie() {
				// affichage du modal de confirmation
				confirm({
				  title: "Confirmation",
				  message: "Voulez-vous supprimer la catégorie "+this.$store.state.selectedCategorie.nom+" ?",
				  okButtonText: "oui",
				  cancelButtonText: "non"
				}).then(result => {	//console.log(result);
					if (result) {
						//console.log("on supprime !");
						this.$store.dispatch("deleteCategorie");
						this.$store.state.updateCategorie = true;
					}
					else {
						//console.log("pas touche !");
					}
				});
			},
			uploadDefis() {
				confirm({
				  title: "Sauvegarde des défis ",
				  message: "Confirmez-vous la sauvegarde des modifications faites sur les défis (suppressions, modifications et ajouts)?",
				  okButtonText: "OK",
				  cancelButtonText: "NON"
				}).then(result => {
				  //console.log(result);
				  if (result) {
					//console.log("On sauvegarde sur le serveur");
					//console.log("defis ALL:"+JSON.stringify(this.$store.state.defis));
					this.defisUpdated = this.$store.state.defis.filter(item => {
						//console.log("defi a upload :"+item.nom+" : "+item.updated); 
						return item.updated == "1";
					});
					//console.log("mesDefis : uploadDefi : nombre de défis à MAJ : "+this.defisUpdated.length);
					//console.log("mesDefis : uploadDefi : "+JSON.stringify(this.defisUpdated));
					
					axios
						  .post('https://www.telethon.citeyen.com/public/api/defis/upload', {
							defis : this.defisUpdated,
						  })
						  .then(response => {
							//console.log("update OK");
							alert({
							  title: "Récupération des défis",
							  message: "Mise à jour des défis à partir du serveur",
							  okButtonText: "OK"
							}).then(() => {
								axios
									.get('https://telethon2020.citeyen.com/api/defi/list')
									.then(response => {
										this.$store.dispatch("reloadDefis",{data : response.data.defis,version : response.data.version});
										
									})
							});
						})
						.catch(error => {
							//console.log("updatete KO : "+error.response);
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
		},
    };
</script>

<style>

.mu-10 {
	margin : 10 0 0 0;
}

mt-20 {
	margin : 20 0 0 0;
}
.borderBottom {
	border-width: 0 0 2 0;
	border-color: gray;
	border-radius : 0;
	padding : 0 0 10 0;
}
.defiTitle {
	color : black;
	font-weight: bold;
	font-size: 20px;
}
.defiDescription {
	color : black;
	font-size: 10px;
	font-weight: normal;
	
}

</style>